"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {

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

      <div className="text-center">

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

        <p className="mt-4">
          Order ID: {orderId}
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

export default function SuccessPage() {

  return (
    <Suspense
      fallback={
        <div>
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}