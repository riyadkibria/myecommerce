// components/SimilarProducts.tsx

import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import Link from "next/link";

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

interface RelatedRef {
  uuid: string;
  full_slug?: string;
}

interface ProductContent {
  name: string;
  Price?: number;
  image?: { filename: string };
}

interface ProductStory {
  uuid: string;
  slug: string;
  content: ProductContent;
}

export default async function SimilarProducts({ relatedRefs }: { relatedRefs: RelatedRef[] }) {
  if (!relatedRefs || relatedRefs.length === 0) {
    console.log("SimilarProducts: No relatedRefs passed or empty");
    return null;
  }

  // Extract UUIDs from relatedRefs array
  const uuids = relatedRefs.map((r) => r.uuid).join(",");

  try {
    const res = await Storyblok.get("cdn/stories", {
      version: "draft",
      by_uuids: uuids,
    });

    const relatedProducts: ProductStory[] = res.data.stories;

    if (!relatedProducts || relatedProducts.length === 0) {
      console.log("SimilarProducts: No valid related products fetched");
      return null;
    }

    return (
      <section className="mt-20 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map((item) => {
            const { name, Price, image } = item.content;
            const imageUrl = image?.filename
              ? `https://a.storyblok.com${image.filename}`
              : null;

            return (
              <Link
                key={item.uuid}
                href={`/products/${item.slug}`}
                className="block bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                  <p className="text-sm text-gray-600">${Number(Price || 0).toFixed(2)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  } catch (error) {
    console.error("SimilarProducts: Failed to fetch related products", error);
    return null;
  }
}
