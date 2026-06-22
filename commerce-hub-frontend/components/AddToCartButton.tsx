"use client";

type Props = {
  product: {
    Id: string;
    Name: string;
    Price__c: number;
  };
};

export default function AddToCartButton({
  product,
}: Props) {

  const handleAddToCart = async () => {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const response = await fetch(
      "/api/cart/add",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          customerId: user.id,
          productId: product.Id,
          price: product.Price__c,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  alert("Added to cart!");
} else {
      alert("Failed to add item.");
      console.log(data);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className="
      bg-blue-600
      px-8
      py-4
      rounded-xl
      hover:bg-blue-700
      transition
      "
    >
      Add To Cart
    </button>
  );
}