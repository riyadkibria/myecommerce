"use client";

import QuantitySelector from "./QuantitySelector";

interface ProductDetailsClientProps {
  name: string;
  description: string;
  price?: number | string;
}

export default function ProductDetailsClient({
  name,
  description,
  price,
}: ProductDetailsClientProps) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2 truncate">
          {name}
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line line-clamp-6">
          {description || "No description available."}
        </p>
      </div>

      <div>
        <p className="text-2xl font-semibold text-green-600 mb-4">
          {price ? `$${price}` : "Price not available"}
        </p>
      </div>

      <QuantitySelector name={name} price={price} />
    </div>
  );
}
