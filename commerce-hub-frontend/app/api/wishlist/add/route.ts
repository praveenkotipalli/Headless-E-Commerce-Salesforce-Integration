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
      productId,
    } = await request.json();

    const accessToken =
      await getAccessToken();

    // CHECK FIRST

    const checkQuery = `
      SELECT Id
      FROM Wishlist__c
      WHERE Customer__c='${customerId}'
      AND Product__c='${productId}'
      LIMIT 1
    `;

    const checkResponse = await fetch(
      `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
        checkQuery
      )}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const checkData =
      await checkResponse.json();

    if (
      checkData.records &&
      checkData.records.length > 0
    ) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
      });
    }

    // CREATE ONLY IF NOT EXISTS

    const response = await fetch(
      `${INSTANCE_URL}/services/data/v67.0/sobjects/Wishlist__c`,
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

          Product__c:
            productId,

          Added_Date__c:
            new Date().toISOString(),
        }),
      }
    );

    const data =
      await response.json();

    return NextResponse.json({
      success: response.ok,
      data,
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      error: String(error),
    });

  }
}