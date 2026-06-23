import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/salesforce";

const INSTANCE_URL =
  process.env.SALESFORCE_INSTANCE_URL!;

export async function POST(
  request: Request
) {
  try {

    const {
  customerId,

  shippingName,
  shippingPhone,

  shippingAddress,
  shippingCity,
  shippingState,
  shippingPincode,

  paymentMethod,

} = await request.json();

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

      console.log("CART STATUS:", cartResponse.status);

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

      console.log("ITEM STATUS:", itemResponse.status);

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

  Shipping_Name__c:
    shippingName,

  Shipping_Phone__c:
    shippingPhone,

  Shipping_Address__c:
    shippingAddress,

  Shipping_City__c:
    shippingCity,

  Shipping_State__c:
    shippingState,

  Shipping_Pincode__c:
    shippingPincode,

  Payment_Method__c:
    paymentMethod,

  Payment_Status__c:
    paymentMethod ===
    "Cash On Delivery"
      ? "Not Paid"
      : "Paid",

}),
        }
      );

      console.log("ORDER STATUS:", orderResponse.status);

    const orderData =
      await orderResponse.json();

      console.log(
  "ORDER RESPONSE"
);

console.log(
  JSON.stringify(
    orderData,
    null,
    2
  )
);


    const orderId =
      orderData.id;

    /*
      STEP 5
      Create Order Items
    */

    for (const item of items) {

  const orderItemResponse =
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

        }),
      }
    );

  const orderItemData =
    await orderItemResponse.json();

  console.log(
    "ORDER ITEM RESPONSE"
  );

  console.log(
    JSON.stringify(
      orderItemData,
      null,
      2
    )
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