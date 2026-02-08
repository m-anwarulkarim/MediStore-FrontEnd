import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddToCartClient from "@/components/products/AddToCartClient";

type Medicine = {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  discountPrice?: number | string | null;
  image?: string | null;
};

async function getMedicine(id: string): Promise<Medicine | null> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!base) return null;

  const res = await fetch(`${base}/api/medicines/${id}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json?.data ?? json;
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getMedicine(id);
  if (!product) notFound();

  const priceRaw = product.discountPrice ?? product.price;
  const price =
    typeof priceRaw === "string" ? parseFloat(priceRaw) : Number(priceRaw);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
              <Image
                src={product.image || "https://placehold.co/800x800"}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {product.description || "No description available."}
            </p>

            <p className="text-2xl font-bold">৳ {price.toFixed(2)}</p>

            <AddToCartClient medicineId={product.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
