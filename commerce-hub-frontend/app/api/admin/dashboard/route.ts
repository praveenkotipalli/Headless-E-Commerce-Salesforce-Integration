import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/salesforce";

const INSTANCE_URL =
  process.env.SALESFORCE_INSTANCE_URL!;

export async function GET() {
  try {

    const accessToken =
      await getAccessToken();

    const headers = {
      Authorization:
        `Bearer ${accessToken}`,
    };

    const [
      productsRes,
      customersRes,
      ordersRes,
      cartsRes,
      wishlistRes,
    ] = await Promise.all([

      fetch(
        `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
          "SELECT Id FROM Product__c"
        )}`,
        { headers }
      ),

      fetch(
        `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
          "SELECT Id FROM Customer__c"
        )}`,
        { headers }
      ),

      fetch(
        `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
          "SELECT Id, Total_Amount__c FROM Order__c"
        )}`,
        { headers }
      ),

      fetch(
        `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
          "SELECT Id FROM Cart__c WHERE Status__c='Active'"
        )}`,
        { headers }
      ),

      fetch(
        `${INSTANCE_URL}/services/data/v67.0/query?q=${encodeURIComponent(
          "SELECT Id FROM Wishlist__c"
        )}`,
        { headers }
      ),

    ]);

    const products =
      await productsRes.json();

    const customers =
      await customersRes.json();

    const orders =
      await ordersRes.json();

    const carts =
      await cartsRes.json();

    const wishlist =
      await wishlistRes.json();

    const revenue =
      (orders.records || [])
        .reduce(
          (
            sum: number,
            order: any
          ) =>
            sum +
            (order.Total_Amount__c || 0),
          0
        );

        const monthlyRevenue = [
  {
    month: "Jan",
    revenue: revenue,
  },
];


    return NextResponse.json({

  products:
    products.records?.length || 0,

  customers:
    customers.records?.length || 0,

  orders:
    orders.records?.length || 0,

  activeCarts:
    carts.records?.length || 0,

  wishlistItems:
    wishlist.records?.length || 0,

  revenue,

  monthlyRevenue,

});

  } catch (error) {

    return NextResponse.json({
      success: false,
      error: String(error),
    });

  }
}