import Link from "next/link";

type ProductCardProps = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
};

export default function ProductCard({
  id,
  name,
  description,
  price,
  image, 
  category
}: ProductCardProps) {
  return (

    <Link href={`/products/${id}`}>
  <div>
   
    <div className="
bg-zinc-900
rounded-3xl
overflow-hidden
border border-zinc-800
hover:border-blue-500
hover:-translate-y-2
hover:shadow-2xl
hover:shadow-blue-500/10
transition-all duration-300
">

      <div className="h-56 overflow-hidden">
        <img
  src={image}
  alt={name}
  className="w-full h-full object-cover"
/>
      </div>

      <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm mb-4">
  {category}
</span>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3">
          {name}
        </h3>

        <p className="text-gray-400">
          {description}
        </p>

        <div className="flex justify-between items-center mt-6">
          <span className="text-blue-400 text-2xl font-bold">
            {price}
          </span>

          <button className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>

    </div>

     ...
  </div>
</Link>
  );
}