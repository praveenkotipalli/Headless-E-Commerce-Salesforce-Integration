import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/salesforce";

const INSTANCE_URL =
  "https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const accessToken =
      await getAccessToken();

    const query = `
  SELECT
Id,
Name,
Order__c,
Product__r.Name,
Quantity__c,
Unit_Price__c
FROM Order_Item__c
WHERE Order__c='${id}'
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


console.log("ORDER DETAILS RESPONSE");
console.log(JSON.stringify(data, null, 2));

return NextResponse.json(data);

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