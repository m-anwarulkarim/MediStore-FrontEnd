"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Med = {
  id: string;
  name: string;
  image?: string | null;
  slug?: string | null;
};

export default function SellerRecentMedicines({
  medicines,
}: {
  medicines?: Med[];
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Recent Medicines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {medicines?.length ? (
          medicines.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="h-10 w-10 rounded-md border bg-muted overflow-hidden">
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.image}
                    alt={m.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{m.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {m.slug ? `Slug: ${m.slug}` : "—"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No medicines found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
