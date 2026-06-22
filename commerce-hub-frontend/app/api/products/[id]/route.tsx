import { getAccessToken } from "@/lib/salesforce";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/data/v67.0/sobjects/Product__c/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const product = await response.json();

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}