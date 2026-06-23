"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import SearchBar from "./SearchBar";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function Navbar() {

  

  const loadCartCount = async () => {
  const storedUser =
    localStorage.getItem("user");

  if (!storedUser) return;

  const user = JSON.parse(storedUser);

  const response = await fetch(
    `/api/cart?customerId=${user.id}`
  );

  const items = await response.json();

  setCartCount(items.length);
};


  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

  const storedUser =
    localStorage.getItem("user");

  if (
    storedUser &&
    storedUser !== "undefined"
  ) {
    try {

      setUser(
        JSON.parse(storedUser)
      );

    } catch {

      localStorage.removeItem(
        "user"
      );

    }
  }

}, []);

  useEffect(() => {

  loadCartCount();

  window.addEventListener(
    "cartUpdated",
    loadCartCount
  );

  return () => {
    window.removeEventListener(
      "cartUpdated",
      loadCartCount
    );
  };

}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-800">

      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-bold text-white"
        >
          Commerce Hub
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">


          <SearchBar />

          <Link
            href="/"
            className="text-gray-300 hover:text-white transition"
          >
            Home
          </Link>

          <Link
            href="/"
            className="text-gray-300 hover:text-white transition"
          >
            Products
          </Link>

           <a href="/wishlist">
    Wishlist
  </a>


<a href="/cart"
  className="hover:text-blue-400 transition">
  Cart ({cartCount})
</a>

      <Link
  href="/orders"
  className="hover:text-blue-400"
>
  Orders
</Link>

      {
  user?.role === "Admin" && (
    <Link href="/admin">
      Admin
    </Link>
  )
}
          

          {!user ? (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="
                  bg-blue-600
                  px-5
                  py-2
                  rounded-xl
                  hover:bg-blue-700
                  transition
                "
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="text-blue-400 font-medium">
                Hi, 
              </div>

              <Link
  href="/profile"
  className="
  hover:text-blue-400
  transition
  "
>
  {user?.name}
</Link>

              <button
                onClick={handleLogout}
                className="
                  bg-red-600
                  px-5
                  py-2
                  rounded-xl
                  hover:bg-red-700
                  transition
                "
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}