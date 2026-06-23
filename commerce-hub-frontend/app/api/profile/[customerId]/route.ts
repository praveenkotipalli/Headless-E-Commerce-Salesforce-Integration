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

    const response =
      await fetch(
        `${INSTANCE_URL}/services/data/v67.0/sobjects/Customer__c/${customerId}`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

    const data =
      await response.json();

    return NextResponse.json(data);

  } catch (error) {

    return NextResponse.json({
      success: false,
      error: String(error),
    });

  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {

    const { customerId } =
      await params;

    const body =
      await request.json();

    const accessToken =
      await getAccessToken();

    await fetch(
      `${INSTANCE_URL}/services/data/v67.0/sobjects/Customer__c/${customerId}`,
      {
        method: "PATCH",
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(body),
      }
    );

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