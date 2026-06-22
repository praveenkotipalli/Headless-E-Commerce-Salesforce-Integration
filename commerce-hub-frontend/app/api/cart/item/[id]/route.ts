import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/salesforce";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const accessToken =
      await getAccessToken();

    const response = await fetch(
      `https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/data/v67.0/sobjects/Cart_Item__c/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to delete item"
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}