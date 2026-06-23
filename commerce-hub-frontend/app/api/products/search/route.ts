import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/salesforce";

const INSTANCE_URL =
  process.env.SALESFORCE_INSTANCE_URL!;

export async function GET(
  request: Request
) {
  try {

    const { searchParams } =
      new URL(request.url);

    const q =
      searchParams.get("q") || "";

    const accessToken =
      await getAccessToken();

    const query = `
      SELECT
      Id,
      Name,
      Price__c,
      Category__c,
      Image_URL__c
      FROM Product__c
      WHERE Name LIKE '%${q}%'
      ORDER BY Name
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