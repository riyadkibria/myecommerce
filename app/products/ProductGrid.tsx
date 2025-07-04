"use client";

import { useEffect, useState } from "react";
import { MyProduct } from "@/types";
import { fetchProducts } from "@/lib/fetchProducts";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [products, setProducts] = useState<MyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedIndex, setAddedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (index: number) => {
    setAddedIndex(index);
    setTimeout(() => setAddedIndex(null), 2000);
  };

  if (loading) return <p className="text-center py-20 text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;

  return (
    <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {products.map((product, i) => (
        <ProductCard
          key={i}
          product={product}
          isAdded={i === addedIndex}
          onAdd={() => handleAddToCart(i)}
        />
      ))}
    </div>
  );
}
