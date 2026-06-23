import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/salesforce";

const INSTANCE_URL =
  process.env.SALESFORCE_INSTANCE_URL!;

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const accessToken =
      await getAccessToken();

    const response = await fetch(
      `${INSTANCE_URL}/services/data/v67.0/sobjects/Wishlist__c/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json({
      success: response.ok,
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      error: String(error),
    });

  }
}