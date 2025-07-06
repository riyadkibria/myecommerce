import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";
import CartWrapper from "./CartWrapper";
import SimilarProducts from "@/app/components/SimilarProducts";

// ✅ Setup Storyblok client
const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

// ✅ Types
interface RelatedRef {
  uuid: string;
  full_slug: string;
}

interface MyProduct {
  name: string;
  description: string;
  Price?: number | string;
  image?: { filename: string } | string;
  relatedproducts?: RelatedRef[];
}

function getImageUrl(image: MyProduct["image"]): string | null {
  if (typeof image === "string") {
    return image.startsWith("//") ? `https:${image}` : image;
  } else if (image?.filename) {
    return `https://a.storyblok.com${image.filename}`;
  }
  return null;
}

// ✅ Correct function signature
export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  try {
    const response = await Storyblok.get(`cdn/stories/products/${slug}`, {
      version: "draft",
    });

    if (!response?.data?.story?.content) {
      console.error("❌ Product content not found");
      return notFound();
    }

    const product: MyProduct = response.data.story.content;

    // Debug logs
    console.log("✅ Product slug:", slug);
    console.log("🧩 Related products:", product.relatedproducts);

    const imageUrl = getImageUrl(product.image);

    return (
      <main className="min-h-screen bg-gradient-to-tr from-white to-gray-100 py-14 px-6 sm:px-10 lg:px-24 xl:px-32">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-16 items-start">
          {/* Product Image */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-200">
            <div className="aspect-[4/3] relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name || "Product"}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  unoptimized
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-base font-semibold">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <section className="flex flex-col justify-between h-full space-y-6">
            <ProductDetailsClient
              name={product.name}
              description={product.description}
              price={product.Price}
            />
          </section>
        </div>

        {/* Cart */}
        <div className="mt-10">
          <CartWrapper />
        </div>

        {/* Similar Products */}
        <SimilarProducts relatedRefs={product.relatedproducts || []} />
      </main>
    );
  } catch (error) {
    console.error("❌ Error loading product page:", error);
    return notFound();
  }
}
