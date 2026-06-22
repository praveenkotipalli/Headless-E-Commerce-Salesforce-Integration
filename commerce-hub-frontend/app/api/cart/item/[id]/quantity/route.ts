import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/salesforce";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const { quantity } =
      await request.json();

    const accessToken =
      await getAccessToken();

    const response = await fetch(
      `https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/data/v67.0/sobjects/Cart_Item__c/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          Quantity__c: quantity,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to update quantity"
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