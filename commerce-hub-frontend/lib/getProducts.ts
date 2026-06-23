export async function getProducts() {
  const response = await fetch(
    // "https://headless-e-commerce-salesforce-inte-ten.vercel.app/api/products",
    "http://localhost:3000/api/products",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}