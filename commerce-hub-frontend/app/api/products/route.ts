import { getAccessToken } from "@/lib/salesforce";
import { NextResponse } from "next/server";

export async function GET() {
  const accessToken = await getAccessToken();;

  const response = await fetch(
    "https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/apexrest/products",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const products = await response.json();

  return NextResponse.json(products);
}