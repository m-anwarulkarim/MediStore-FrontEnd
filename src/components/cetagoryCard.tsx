/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";

const CetagoryCard = ({ category }: { category: any }) => {
  const list = category?.data?.data ?? [];

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-semibold text-4xl tracking-tight sm:text-5xl">
          Explore Medistor Categories
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((feature: any) => (
            <Link
              key={feature.id}
              href="/products"
              className="group rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted transition group-hover:scale-105">
                  {feature.image ? (
                    <Image
                      src={feature.image}
                      alt={feature.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No Image
                    </span>
                  )}
                </div>

                <div>
                  <div className="font-semibold text-lg leading-tight">
                    {feature.name}
                  </div>
                  <p className="mt-1 text-sm text-foreground/70 line-clamp-2">
                    {feature.description || "Browse medicines in this category"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CetagoryCard;
