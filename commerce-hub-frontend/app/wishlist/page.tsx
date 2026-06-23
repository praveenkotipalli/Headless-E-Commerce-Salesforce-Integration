"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function WishlistPage() {

  const removeWishlist =
  async (wishlistId: string) => {

    await fetch(
      `/api/wishlist/remove/${wishlistId}`,
      {
        method: "DELETE",
      }
    );

    setItems(
      items.filter(
        item =>
          item.Id !== wishlistId
      )
    );
};

  const [items, setItems] =
    useState<any[]>([]);

  useEffect(() => {

    const loadWishlist =
      async () => {

        const user =
          JSON.parse(
            localStorage.getItem("user")
            || "{}"
          );

        const response =
          await fetch(
            `/api/wishlist/${user.id}`
          );

        const data =
          await response.json();

        setItems(data);
      };

    loadWishlist();

  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-8 py-12">

        <h1 className="text-5xl font-bold mb-10">
          Wishlist ❤️
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {items.map(item => (

            

            <div
              key={item.Id}
              className="
              bg-zinc-900
              rounded-3xl
              overflow-hidden
              "
            >
              <Link href={`/products/${item.Id}`}>
              <img
                src={
                  item.Product__r
                    .Image_URL__c
                }
                alt={
                  item.Product__r
                    .Name
                }
                className="
                h-64
                w-full
                object-cover
                "
              />

              <div className="p-6">

                <h2
                  className="
                  text-2xl
                  font-bold
                  "
                >
                  {
                    item.Product__r
                      .Name
                  }
                </h2>

                <p
                  className="
                  text-blue-400
                  mt-3
                  "
                >
                  ₹
                  {
                    item.Product__r
                      .Price__c
                  }
                </p>

              </div>


              <button
  onClick={() =>
    removeWishlist(item.Id)
  }
  className="
  mt-4
  bg-red-600
  px-4
  py-2
  rounded-xl
  hover:bg-red-700
  "
>
  Remove
</button>
</Link>
            </div>

          ))}

        </div>

      </div>

    </main>
  );
}