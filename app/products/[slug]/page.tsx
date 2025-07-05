import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";
import CartWrapper from "./CartWrapper";
import Link from "next/link";

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

interface RelatedProduct {
  uuid: string;
  full_slug: string;
  content: {
    name: string;
    Price?: number | string;
    image?: { filename: string } | string;
  };
}

interface MyProduct {
  name: string;
  description: string;
  Price?: number | string;
  image?: { filename: string } | string;
  related_products?: RelatedProduct[];
}

function getImageUrl(image: MyProduct["image"]): string | null {
  if (typeof image === "string") {
    return image.startsWith("//") ? `https:${image}` : image;
  } else if (image?.filename) {
    return `https://a.storyblok.com${image.filename}`;
  }
  return null;
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  try {
    const response = await Storyblok.get(`cdn/stories/products/${slug}`, {
      version: "draft",
    });

    if (!response?.data?.story?.content) return notFound();

    const product: MyProduct = response.data.story.content;
    const imageUrl = getImageUrl(product.image);
    const related = product.related_products || [];

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

          {/* Product Details */}
          <section className="flex flex-col justify-between h-full space-y-6">
            <ProductDetailsClient
              name={product.name}
              description={product.description}
              price={product.Price}
            />
          </section>
        </div>

        {/* Cart */}
        <div className="mt-12">
          <CartWrapper />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((item) => {
                const { name, Price, image } = item.content;
                const imageUrl =
                  typeof image === "string"
                    ? image.startsWith("//")
                      ? `https:${image}`
                      : image
                    : image?.filename
                    ? `https://a.storyblok.com${image.filename}`
                    : null;

                return (
                  <Link
                    key={item.uuid}
                    href={`/${item.full_slug}`}
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
                      <p className="text-sm text-gray-600">
                        ${Number(Price || 0).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    );
  } catch {
    return notFound();
  }
}
