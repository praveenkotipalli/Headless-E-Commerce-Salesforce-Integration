import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/salesforce";

export async function GET(request: Request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const customerId =
      searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        {
          success: false,
          error: "customerId required",
        },
        {
          status: 400,
        }
      );
    }

    const accessToken =
      await getAccessToken();

    /*
      Find Active Cart
    */

    const cartQuery = `
      SELECT Id
      FROM Cart__c
      WHERE Customer__c='${customerId}'
      AND Status__c='Active'
      LIMIT 1
    `;

    const cartResponse = await fetch(
      `https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/data/v67.0/query?q=${encodeURIComponent(
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

    if (
      !cartData.records ||
      cartData.records.length === 0
    ) {
      return NextResponse.json([]);
    }

    const cartId =
      cartData.records[0].Id;

    /*
      Get Cart Items
    */

    const itemQuery = `
      SELECT
      Id,
      Quantity__c,
      Unit_Price__c,
      Line_Total__c,
      Product__c,
      Product__r.Name,
      Product__r.Image_URL__c
      FROM Cart_Item__c
      WHERE Cart__c='${cartId}'
    `;

    const itemResponse = await fetch(
      `https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/data/v67.0/query?q=${encodeURIComponent(
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

    return NextResponse.json(
      itemData.records || []
    );

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}