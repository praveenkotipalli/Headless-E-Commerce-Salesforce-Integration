"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage() {

  const [orders, setOrders] =
    useState<any[]>([]);

  useEffect(() => {

    const loadOrders = async () => {

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const response = await fetch(
        `/api/orders/${user.id}`
      );

      const data =
        await response.json();

      setOrders(data);
    };

    loadOrders();

  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-6xl mx-auto px-8 py-12">

        <h1 className="text-5xl font-bold mb-10">
          My Orders
        </h1>

        <div className="space-y-6">

          {orders.map(order => (

            <div
              key={order.Id}
              className="
              bg-zinc-900
              rounded-3xl
              p-6
              "
            >

                <Link href={`/orders/${order.Id}`}>
              <h2 className="text-2xl font-bold">
                {order.Name}
              </h2>

              <p className="text-blue-400 mt-2">
                {order.Status__c}
              </p>

              <p className="mt-2">
                ₹{order.Total_Amount__c}
              </p>

              <p className="text-gray-400 mt-2">
                {new Date(
                  order.Order_Date__c
                ).toLocaleString()}
              </p>

              </Link>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}