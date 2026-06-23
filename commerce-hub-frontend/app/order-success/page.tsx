"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {

  const params =
    useSearchParams();

  const orderId =
    params.get("orderId");

  return (
    <main className="
    min-h-screen
    bg-black
    text-white
    flex
    items-center
    justify-center
    ">

      <div className="
      text-center
      ">

        <h1 className="
        text-6xl
        font-bold
        text-green-500
        ">
          ✅
        </h1>

        <h2 className="
        text-4xl
        font-bold
        mt-6
        ">
          Payment Successful
        </h2>

        <p className="
        mt-4
        text-gray-400
        ">
          Order ID:
          {" "}
          {orderId}
        </p>

        <Link
          href="/orders"
          className="
          inline-block
          mt-8
          bg-blue-600
          px-6
          py-3
          rounded-xl
          "
        >
          View Orders
        </Link>

      </div>

    </main>
  );
}