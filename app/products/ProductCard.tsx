"use client";

import Image from "next/image";
import { MyProduct } from "@/types";
import { useCart } from "@/app/context/CartContext";

interface Props {
  product: MyProduct;
  isAdded: boolean;
  onAdd: () => void;
}

const fallbackImage =
  "https://a.storyblok.com/f/285405591159825/4032x2688/ca2804d8c3/image-couple-relaxing-tropical-beach-sunset-hotel-vacation-tourism.jpg";

export default function ProductCard({ product, isAdded, onAdd }: Props) {
  const { addToCart } = useCart();

  const handleClick = () => {
    const priceNumber = Number(product.price);
    addToCart({
      name: product.name || "Unnamed Product",
      price: isNaN(priceNumber) ? 0 : priceNumber,
      quantity: 1, // ✅ required by CartItem
    });
    onAdd();
  };

  return (
    <article className="bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
      <div className="relative w-full aspect-[4/3] border-b border-gray-200">
        <Image
          src={product.image?.filename || fallbackImage}
          alt={product.name || "Product Image"}
          fill
          style={{ objectFit: "cover" }}
          quality={85}
          className="rounded-t-xl"
          draggable={false}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-gray-900 text-sm font-semibold mb-1">
          {product.name || "Unnamed Product"}
        </h2>

        <p className="text-gray-600 text-sm mb-3 flex-grow">
          {product.description || "No description available."}
        </p>

        <p className="text-gray-800 text-sm font-medium mb-3">
          Price:{" "}
          <span className="font-semibold">
            ${isNaN(Number(product.price)) ? "N/A" : product.price}
          </span>
        </p>

        <button
          onClick={handleClick}
          className={`py-2 text-sm font-semibold text-white rounded-md ${
            isAdded ? "bg-green-600 cursor-default" : "bg-gray-800 hover:bg-gray-700"
          }`}
          disabled={isAdded}
          aria-pressed={isAdded}
          aria-label={isAdded ? "Added to cart" : `Add ${product.name} to cart`}
        >
          🛒 {isAdded ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
