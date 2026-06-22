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
      Name,
      Status__c,
      Total_Amount__c,
      Order_Date__c
      FROM Order__c
      WHERE Customer__c='${customerId}'
      ORDER BY CreatedDate DESC
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