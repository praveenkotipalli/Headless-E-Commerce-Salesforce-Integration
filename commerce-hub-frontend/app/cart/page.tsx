"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);

    const removeItem = async (
  cartItemId: string
) => {

  // Update UI immediately
  setItems(prev =>
    prev.filter(
      item => item.Id !== cartItemId
    )
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  // Delete in background
  await fetch(
    `/api/cart/item/${cartItemId}`,
    {
      method: "DELETE",
    }
  );
};

  const updateQuantity = async (
  cartItemId: string,
  quantity: number
) => {

  if (quantity < 1) return;

  setItems(prev =>
    prev.map(item =>
      item.Id === cartItemId
        ? {
            ...item,
            Quantity__c: quantity,
            Line_Total__c:
              quantity *
              item.Unit_Price__c,
          }
        : item
    )
  );

  await fetch(
    `/api/cart/item/${cartItemId}/quantity`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        quantity,
      }),
    }
  );
};

  useEffect(() => {
    const loadCart = async () => {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const response = await fetch(
        `/api/cart?customerId=${user.id}`
      );

      const data =
        await response.json();

      setItems(data);
      setLoading(false);
    };

    loadCart();
  }, []);

  const total = items.reduce(
    (sum, item) =>
      sum + item.Line_Total__c,
    0
  );

  if (loading) {
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-6xl mx-auto px-8 py-12">

        <h1 className="text-5xl font-bold mb-10">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div>
            Cart is empty.
          </div>
        ) : (
          <>
            <div className="space-y-6">

              {items.map((item) => (
                <div
                  key={item.Id}
                  className="
                  bg-zinc-900
                  rounded-3xl
                  p-6
                  flex
                  justify-between
                  items-center
                  "
                >
                  <div>

                    <h2 className="text-2xl font-bold">
                      {
                        item.Product__r
                          .Name
                      }
                    </h2>

                    <div className="flex items-center gap-3 mt-3">

  <button
    onClick={() =>
      updateQuantity(
        item.Id,
        item.Quantity__c - 1
      )
    }
    className="
    bg-zinc-700
    px-3
    py-1
    rounded
    "
  >
    -
  </button>

  <span>
    {item.Quantity__c}
  </span>

  <button
    onClick={() =>
      updateQuantity(
        item.Id,
        item.Quantity__c + 1
      )
    }
    className="
    bg-zinc-700
    px-3
    py-1
    rounded
    "
  >
    +
  </button>

</div>

                    <p>
                      ₹
                      {
                        item.Unit_Price__c
                      }
                    </p>

                    <button
  onClick={() =>
    removeItem(item.Id)
  }
  className="
  bg-red-600
  px-4
  py-2
  rounded-xl
  hover:bg-red-700
  "
>
  Remove
</button>

                  </div>

                  <div className="text-blue-400 text-xl">

                    ₹
                    {
                      item.Line_Total__c
                    }

                  </div>
                </div>
              ))}

            </div>

            <div
              className="
              mt-10
              bg-zinc-900
              rounded-3xl
              p-8
              "
            >

              <div className="flex justify-between text-3xl font-bold">

                <span>Total</span>

                <span>
                  ₹
                  {total.toLocaleString()}
                </span>

              </div>

              <Link
  href="/checkout"
  className="
  bg-green-600
  px-8
  py-4
  rounded-xl
  "
>
  Proceed To Checkout
</Link>

            </div>
          </>
        )}

      </div>

    </main>
  );
}