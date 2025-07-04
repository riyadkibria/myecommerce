"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext"; // ✅ Make sure this is the correct path
import CartMenu from "@/app/components/CartMenu"; // adjust path if needed


interface MyProduct {
  component: string;
  name: string;
  description: string;
  image?: { filename: string } | string;
  price?: number | string;
  Price?: number | string; // From Storyblok
  slug?: string;
  _version?: number;
}

interface StoryblokStory {
  slug: string;
  content: MyProduct;
  _version?: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default function Page() {
  const [products, setProducts] = useState<MyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [addedToCartIndex, setAddedToCartIndex] = useState<number | null>(null);

  const { addToCart } = useCart(); // ✅ useCart hook to access addToCart

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;
    if (!token) {
      setErrorMsg("❌ Storyblok token not found.");
      setLoading(false);
      return;
    }

    const url = `https://api.storyblok.com/v2/cdn/stories?starts_with=product&version=draft&token=${token}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const stories: StoryblokStory[] = data.stories || [];
        const productList: MyProduct[] = stories.map((story) => ({
          ...story.content,
          price: story.content.Price,
          slug: story.slug,
          _version: story._version,
        }));
        setProducts(productList);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Updated Add to Cart Handler
  const handleAddToCart = (product: MyProduct, index: number) => {
    const price =
      typeof product.Price === "string"
        ? parseFloat(product.Price)
        : product.Price;

    if (price === undefined || isNaN(price)) {
      alert("Invalid price");
      return;
    }

    addToCart({
      name: product.name || "Unnamed Product",
      price,
      quantity: 1,
    });

    setAddedToCartIndex(index);
    setTimeout(() => setAddedToCartIndex(null), 1500);
  };

  const getImageUrl = (image: MyProduct["image"], version?: number): string | null => {
    if (typeof image === "string") {
      return image.startsWith("//") ? `https:${image}` : image;
    } else if (image?.filename) {
      return `https://a.storyblok.com${image.filename}?v=${version || "1"}`;
    }
    return null;
  };

  if (loading || errorMsg || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg font-medium px-4">
        {errorMsg ? `❌ ${errorMsg}` : "Loading products..."}
      </div>
    );
  }

  return (
    <main className="px-4 py-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Our Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, i) => {
          const slug = product.slug || slugify(product.name || `product-${i}`);
          const imageUrl = getImageUrl(product.image, product._version);

          return (
            <Link key={slug} href={`/products/${slug}`} passHref legacyBehavior>
              <a className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-none">
                <div className="relative w-full pt-[61.8%] bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name || "Product image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                      No image available
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div className="mb-2">
                    <h2 className="font-semibold text-gray-800 text-base truncate">
                      {product.name || "Unnamed Product"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-green-600 font-semibold text-sm mb-2">
                      ${product.price ?? "N/A"}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product, i); // ✅ Pass product here
                      }}
                      className={`w-full text-sm font-medium px-3 py-2 rounded-md text-white ${
                        addedToCartIndex === i
                          ? "bg-green-600"
                          : "bg-blue-600"
                      }`}
                    >
                      {addedToCartIndex === i ? "✔ Added" : "🛒 Add to Cart"}
                    </button>
                  </div>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
       {/* ✅ Add cart here */}
    <div className="mt-10">
      <CartMenu />
    </div>
    </main>
  );
}
