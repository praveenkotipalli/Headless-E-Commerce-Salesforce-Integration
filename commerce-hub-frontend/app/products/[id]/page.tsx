import AddToCartButton from "@/components/AddToCartButton";
import { getProductById } from "@/lib/salesforce";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetails({
  params,
}: Props) {
  const { id } = await params;

  const response = await fetch(
    `http://localhost:3000/api/products/${id}`,
    {
      cache: "no-store",
    }
  );

  const product = await getProductById(id);

  if (!product || !product.Id) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl">
        Product Not Found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-8 py-16">

        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300"
        >
          ← Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mt-10">

          {/* Product Image */}
          <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">

            <img
              src={product.Image_URL__c}
              alt={product.Name}
              className="w-full h-[500px] object-cover"
            />

          </div>

          {/* Product Details */}
          <div>

            <span className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-400">
              {product.Category__c}
            </span>

            <h1 className="text-5xl font-bold mt-6">
              {product.Name}
            </h1>

            <p className="text-4xl font-bold text-blue-400 mt-6">
              ₹{product.Price__c}
            </p>

            <div className="mt-8 space-y-4 text-gray-300">

              <p>
                <strong>SKU:</strong>{" "}
                {product.SKU__c}
              </p>

              <p>
                <strong>Stock:</strong>{" "}
                {product.Stock__c}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {product.Is_Active__c
                  ? "Available"
                  : "Out Of Stock"}
              </p>

            </div>

            <div className="mt-10 flex gap-4">

              <AddToCartButton product={product} />

              <button
                className="
                border
                border-zinc-700
                px-8
                py-4
                rounded-xl
                hover:bg-zinc-900
                transition
                "
              >
                Add To Wishlist
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}