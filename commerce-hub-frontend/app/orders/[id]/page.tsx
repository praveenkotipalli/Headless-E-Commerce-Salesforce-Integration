"use client";

import { useEffect, useState } from "react";

export default function OrderDetails({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {

  const [items, setItems] =
    useState<any[]>([]);

  useEffect(() => {

    const load = async () => {

      const { id } =
        await params;

      const response =
        await fetch(
          `/api/orders/details/${id}`
        );

      const data = await response.json();

setItems(data.records || []);
    };

    load();

  }, []);

  const total =
    items.reduce(
      (sum, item) =>
        sum +
        item.Quantity__c *
        item.Unit_Price__c,
      0
    );

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-5xl mx-auto px-8 py-12">

        <h1 className="text-5xl font-bold mb-10">
          Order Details
        </h1>

        <div className="space-y-6">

          {items.map(item => (

            <div
              key={item.Id}
              className="
              bg-zinc-900
              rounded-3xl
              p-6
              "
            >

              <h2 className="text-2xl font-bold">
                {item.Product__r.Name}
              </h2>

              <p>
                Quantity:
                {" "}
                {item.Quantity__c}
              </p>

              <p>
                Price:
                {" "}
                ₹{item.Unit_Price__c}
              </p>

            </div>

          ))}

        </div>

        <div
          className="
          mt-10
          bg-zinc-900
          rounded-3xl
          p-6
          text-3xl
          font-bold
          "
        >
          Total:
          {" "}
          ₹{total.toLocaleString()}
        </div>

      </div>

    </main>
  );
}