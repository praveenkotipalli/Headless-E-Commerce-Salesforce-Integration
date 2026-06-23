import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/salesforce";

const INSTANCE_URL =
  process.env.SALESFORCE_INSTANCE_URL!;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {

    const { customerId } =
      await params;

    const accessToken =
      await getAccessToken();

    const query = `
      SELECT
      Id,
      Added_Date__c,
      Product__c,
      Product__r.Name,
      Product__r.Price__c,
      Product__r.Image_URL__c,
      Product__r.Category__c
      FROM Wishlist__c
      WHERE Customer__c='${customerId}'
      ORDER BY Added_Date__c DESC
    `;

    const response = await fetch(
      `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data =
      await response.json();

    return NextResponse.json(
      data.records || []
    );

  } catch (error) {

    return NextResponse.json({
      success: false,
      error: String(error),
    });

  }
}