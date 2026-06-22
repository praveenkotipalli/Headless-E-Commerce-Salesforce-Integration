import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/salesforce";

const INSTANCE_URL =
  process.env.SALESFORCE_INSTANCE_URL!;

export async function POST(
  request: Request
) {
  try {

    const { customerId } =
      await request.json();

    const accessToken =
      await getAccessToken();

      console.log(
  "TOKEN GENERATED:",
  accessToken.substring(0, 20)
);

    /*
      STEP 1
      Find Active Cart
    */

    const cartQuery = `
      SELECT Id
      FROM Cart__c
      WHERE Customer__c='${customerId}'
      AND Status__c='Active'
      LIMIT 1
    `;

    const cartResponse =
      await fetch(
        `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
          cartQuery
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

    const cartData =
      await cartResponse.json();

      console.log("CART QUERY RESULT");
console.log(JSON.stringify(cartData, null, 2));

    if (
      !cartData.records ||
      cartData.records.length === 0
    ) {
      return NextResponse.json({
        success: false,
        error: "No active cart found",
      });
    }

    const cartId =
      cartData.records[0].Id;

    /*
      STEP 2
      Get Cart Items
    */

    const itemQuery = `
      SELECT
      Id,
      Product__c,
      Quantity__c,
      Unit_Price__c,
      Line_Total__c
      FROM Cart_Item__c
      WHERE Cart__c='${cartId}'
    `;

    const itemResponse =
      await fetch(
        `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
          itemQuery
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

    const itemData =
      await itemResponse.json();

    const items =
      itemData.records || [];

    if (items.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Cart is empty",
      });
    }

    /*
      STEP 3
      Calculate Total
    */

    const totalAmount =
      items.reduce(
        (
          sum: number,
          item: any
        ) =>
          sum +
          item.Line_Total__c,
        0
      );

    /*
      STEP 4
      Create Order
    */

    const orderResponse =
      await fetch(
        `${INSTANCE_URL}/services/data/v67.0/sobjects/Order__c`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            Customer__c:
              customerId,

            Status__c:
              "Pending",

            Total_Amount__c:
              totalAmount,

            Order_Date__c:
              new Date().toISOString(),
          }),
        }
      );

    const orderData =
      await orderResponse.json();

    const orderId =
      orderData.id;

    /*
      STEP 5
      Create Order Items
    */

    for (const item of items) {

      await fetch(
        `${INSTANCE_URL}/services/data/v67.0/sobjects/Order_Item__c`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            Order__c:
              orderId,

            Product__c:
              item.Product__c,

            Quantity__c:
              item.Quantity__c,

            Unit_Price__c:
              item.Unit_Price__c,

            Line_Total__c:
              item.Line_Total__c,
          }),
        }
      );
    }

    /*
      STEP 6
      Mark Cart Checked Out
    */

    await fetch(
      `${INSTANCE_URL}/services/data/v67.0/sobjects/Cart__c/${cartId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          Status__c:
            "Checked Out",
        }),
      }
    );

    return NextResponse.json({
      success: true,
      orderId,
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      error: String(error),
    });

  }
}