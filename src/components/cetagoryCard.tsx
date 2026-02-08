/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";

const CetagoryCard = ({ category }: { category: any }) => {
  const data: any = category.data;

  return (
    <div className="flex min-h-sm items-center justify-center py-12">
      <div>
        <h2 className="text-center font-semibold text-4xl tracking-tight sm:text-5xl">
          Explore Medistor category
        </h2>

        <div className="mx-auto mt-10 grid max-w-7xl gap-6 px-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((feature: any) => {
            return (
              <div
                className="flex flex-col rounded-xl border px-5 py-6"
                key={feature.id}
              >
                <Link href={"/medicines"}>
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    {feature.image ? (
                      <Image
                        src={feature.image} // URL from API
                        alt={feature.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="text-sm text-gray-400">No Image</div>
                    )}
                  </div>
                  <span className="font-semibold text-lg">{feature.name}</span>
                </Link>
                <p className="mt-1 text-[15px] text-foreground/80">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CetagoryCard;
