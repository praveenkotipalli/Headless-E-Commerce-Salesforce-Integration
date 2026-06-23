"use client";



import { useRouter } from "next/navigation";
import RevenueChart from "@/components/RevenueChart";
import { useEffect, useState } from "react";

export default function AdminPage() {

  const [stats, setStats] =
    useState<any>(null);

  useEffect(() => {

    const loadStats =
      async () => {

        const response =
          await fetch(
            "/api/admin/dashboard"
          );

        const data =
          await response.json();

        setStats(data);
      };

    loadStats();

  }, []);

  const router = useRouter();

useEffect(() => {

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  if (
    !user ||
    user.role !== "Admin"
  ) {
    router.push("/");
  }

}, []);

  if (!stats) {
    return (
      <div className="
      min-h-screen
      bg-black
      text-white
      flex
      items-center
      justify-center
      ">
        Loading...
      </div>
    );
  }

  return (
    <main className="
    min-h-screen
    bg-black
    text-white
    p-10
    ">

      <h1 className="
      text-5xl
      font-bold
      mb-10
      ">
        Admin Dashboard 📊
      </h1>

      <div className="
      grid
      md:grid-cols-2
      lg:grid-cols-3
      gap-8
      ">

        <Card
          title="Products"
          value={stats.products}
        />

        <Card
          title="Customers"
          value={stats.customers}
        />

        <Card
          title="Orders"
          value={stats.orders}
        />

        <Card
          title="Active Carts"
          value={stats.activeCarts}
        />

        <Card
          title="Wishlist Items"
          value={stats.wishlistItems}
        />

        <Card
          title="Revenue"
          value={`₹${stats.revenue}`}
        />

        <RevenueChart
    data={
      stats.monthlyRevenue
    }
  />

      </div>

    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="
    bg-zinc-900
    p-8
    rounded-3xl
    border
    border-zinc-800
    ">

      <h2 className="
      text-xl
      text-gray-400
      ">
        {title}
      </h2>

      <p className="
      text-5xl
      font-bold
      mt-4
      ">
        {value}
      </p>

      <div className="mt-10">

  

</div>

    </div>
  );
}