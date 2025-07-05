import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import Link from "next/link";

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

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

export default async function SimilarProducts({ relatedRefs }: { relatedRefs: string[] }) {
  if (!relatedRefs || relatedRefs.length === 0) {
    console.log("SimilarProducts: No relatedRefs passed or empty");
    return null;
  }

  // First, fetch each story by UUID to get full_slug
  const relatedStories = await Promise.all(
    relatedRefs.map(async (uuid) => {
      try {
        const res = await Storyblok.get(`cdn/stories/${uuid}`, {
          version: "draft",
          by_uuids: true,
        });
        return res.data.stories?.[0] as ProductStory;
      } catch (error) {
        console.error(`SimilarProducts: Failed to fetch story by UUID '${uuid}'`, error);
        return null;
      }
    })
  );

  const validStories = relatedStories.filter(Boolean) as ProductStory[];

  if (validStories.length === 0) {
    console.log("SimilarProducts: No valid stories found from UUIDs");
    return null;
  }

  // Now, fetch full product data by full_slug
  const relatedProducts = await Promise.all(
    validStories.map(async (story) => {
      try {
        const res = await Storyblok.get(`cdn/stories/${story.full_slug}`, {
          version: "draft",
        });
        return res.data.story as ProductStory;
      } catch (error) {
        console.error(`SimilarProducts: Failed to fetch story by slug '${story.full_slug}'`, error);
        return null;
      }
    })
  );

  const filtered = relatedProducts.filter(Boolean) as ProductStory[];

  if (filtered.length === 0) {
    console.log("SimilarProducts: No valid related products fetched");
    return null;
  }

  return (
    <section className="mt-20 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Similar Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((item) => {
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
}
