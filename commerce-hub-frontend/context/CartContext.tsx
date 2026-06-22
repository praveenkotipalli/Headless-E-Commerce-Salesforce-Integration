"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type CartItem = {
  Id: string;
  Name: string;
  Price__c: number;
  Image_URL__c: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
};

const CartContext = createContext<CartContextType | null>(
  null
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: CartItem) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev.filter((item) => item.Id !== id)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}