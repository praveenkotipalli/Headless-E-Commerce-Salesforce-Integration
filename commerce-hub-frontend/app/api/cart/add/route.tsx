import { getAccessToken } from "@/lib/salesforce";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      customerId,
      productId,
      price,
    } = await request.json();

    const accessToken =
      await getAccessToken();

    /*
      STEP 1
      Find Active Cart
    */

    const query = `
      SELECT Id
      FROM Cart__c
      WHERE Customer__c='${customerId}'
      AND Status__c='Active'
      LIMIT 1
    `;

    const cartResponse = await fetch(
      `https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/data/v67.0/query?q=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

   const cartData = await cartResponse.json();

console.log("===============");
console.log("CART RESPONSE");
console.log(JSON.stringify(cartData, null, 2));
console.log("===============");

    let cartId;

    /*
      STEP 2
      Create Cart If Not Exists
    */

    if (
      cartData.totalSize === 0
    ) {
      const createCart =
        await fetch(
          "https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/data/v67.0/sobjects/Cart__c",
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
                "Active",
            }),
          }
        );

      const newCart =
        await createCart.json();

      cartId = newCart.id;
    } else {
      cartId =
        cartData.records[0].Id;
    }

    /*
      STEP 3
      Create Cart Item
    */

    const itemResponse =
      await fetch(
        "https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/data/v67.0/sobjects/Cart_Item__c",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
  Cart__c: cartId,
  Product__c: productId,
  Quantity__c: 1,
  Unit_Price__c: price,
}),
        }
      );

    const item =
      await itemResponse.json();

    return NextResponse.json({
      success: true,
      item,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}