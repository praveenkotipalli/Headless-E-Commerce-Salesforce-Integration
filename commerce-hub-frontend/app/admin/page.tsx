"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {

  const [stats, setStats] =
    useState<any>(null);

  useEffect(() => {

    const loadStats =
      async () => {

        const response =
          await fetch(
            "/api/admin/stats"
          );

        const data =
          await response.json();

        setStats(data);
      };

    loadStats();

  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-8 py-12">

        <h1 className="text-5xl font-bold mb-12">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-zinc-900 p-8 rounded-3xl">
            <h2 className="text-gray-400">
              Customers
            </h2>

            <p className="text-5xl font-bold mt-4">
              {stats.customers}
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl">
            <h2 className="text-gray-400">
              Products
            </h2>

            <p className="text-5xl font-bold mt-4">
              {stats.products}
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl">
            <h2 className="text-gray-400">
              Orders
            </h2>

            <p className="text-5xl font-bold mt-4">
              {stats.orders}
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl">
            <h2 className="text-gray-400">
              Revenue
            </h2>

            <p className="text-3xl font-bold mt-4 text-green-400">
              ₹{stats.revenue.toLocaleString()}
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}