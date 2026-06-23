import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/salesforce";

const INSTANCE_URL =
  process.env.SALESFORCE_INSTANCE_URL!;

export async function GET() {
  try {

    const accessToken =
      await getAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const customerRes = await fetch(
      `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
        "SELECT count() FROM Customer__c"
      )}`,
      { headers }
    );

    const productRes = await fetch(
      `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
        "SELECT count() FROM Product__c"
      )}`,
      { headers }
    );

    const orderRes = await fetch(
      `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
        "SELECT count() FROM Order__c"
      )}`,
      { headers }
    );

    const revenueRes = await fetch(
      `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
        "SELECT Total_Amount__c FROM Order__c"
      )}`,
      { headers }
    );

    const customers =
      await customerRes.json();

    const products =
      await productRes.json();

    const orders =
      await orderRes.json();

    const revenueData =
      await revenueRes.json();

    const revenue =
      revenueData.records?.reduce(
        (sum: number, order: any) =>
          sum + (order.Total_Amount__c || 0),
        0
      ) || 0;

    return NextResponse.json({
      customers:
        customers.totalSize,

      products:
        products.totalSize,

      orders:
        orders.totalSize,

      revenue,
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      error: String(error),
    });

  }
}