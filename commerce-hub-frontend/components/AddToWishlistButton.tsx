"use client";

export default function AddToWishlistButton({
  productId,
}: {
  productId: string;
}) {

  const addToWishlist =
    async () => {

      const user =
        JSON.parse(
          localStorage.getItem("user")
          || "{}"
        );

      const response =
        await fetch(
          "/api/wishlist/add",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              customerId:
                user.id,

              productId,
            }),
          }
        );

      const data =
        await response.json();

      if (data.success) {
        alert(
          "Added to Wishlist ❤️"
        );
      }
    };

  return (
    <button
      onClick={addToWishlist}
      className="
      border
      border-zinc-700
      px-8
      py-4
      rounded-xl
      hover:bg-zinc-900
      "
    >
      Add To Wishlist ❤️
    </button>
  );
}