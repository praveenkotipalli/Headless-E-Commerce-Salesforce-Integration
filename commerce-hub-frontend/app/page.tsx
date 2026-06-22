
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/getProducts";




export default async function Home() {

  const products = await getProducts();
  return (

    <main className="min-h-screen bg-black text-white">

      
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <p className="text-blue-400 font-semibold mb-4 mt-10">
          Salesforce Powered Commerce
        </p>

        <h1 className="text-6xl font-bold max-w-5xl leading-tight">
          Commerce Hub
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mt-6">
          Modern Headless E-Commerce Platform powered by Salesforce,
          Apex REST APIs and Next.js.
        </p>

        <div className="flex gap-4 mt-10">
          <button className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700">
            Shop Now
          </button>

          <button className="border border-gray-600 px-6 py-3 rounded-xl hover:bg-gray-900">
            Learn More
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-12">
  <h2 className="text-4xl font-bold mb-12">
    Featured Products
  </h2>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

  {products.map((product: any) => (

    <ProductCard
    key={product.Id}
    id={product.Id}
    name={product.Name}
    description={product.Category__c}
    price={`₹${product.Price__c}`}
    image={product.Image_URL__c}
    category={product.Category__c}
  />

  ))}

</div>
</section>
      

    </main>
    
  );
}