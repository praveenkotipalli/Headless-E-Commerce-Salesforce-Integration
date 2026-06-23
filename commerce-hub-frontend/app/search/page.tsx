import ProductCard
from "@/components/ProductCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {

  const { q = "" } =
    await searchParams;

  const response =
    await fetch(
      `http://localhost:3000/api/products/search?q=${q}`,
      {
        cache:
          "no-store",
      }
    );

  const products =
    await response.json();

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-8 py-12">

        <h1 className="text-4xl font-bold mb-10">

          Search Results:
          {" "}
          {q}

        </h1>

        <div
          className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-8
          "
        >

          {products.map(
            (product: any) => (

              <ProductCard
                key={
                  product.Id
                }
                id={
                  product.Id
                }
                name={
                  product.Name
                }
                description={
                  product.Category__c
                }
                price={`₹${product.Price__c}`}
                image={
                  product.Image_URL__c
                }
                category={
                  product.Category__c
                }
              />

            )
          )}

        </div>

      </div>

    </main>
  );
}