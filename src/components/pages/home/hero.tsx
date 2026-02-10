import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeroPharmacyIllustration from "../../../../public/HeroPharmacyIllustration";

export default function HeroSction() {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) gap-12 px-6 py-12 lg:grid-cols-2">
        <div>
          <Badge
            asChild
            className="rounded-full border-border py-1 px-4"
            variant="secondary"
          >
            <Link href="/products">
              💊 Trusted Online Pharmacy{" "}
              <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </Badge>

          <h1 className="mt-6 max-w-[18ch] font-semibold text-4xl leading-[1.2] tracking-[-0.035em] md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]">
            Buy Genuine Medicines Online with Confidence
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-[60ch] text-foreground/80 sm:text-lg">
            Medistor makes healthcare simple. Order genuine medicines and
            wellness products online with fast delivery, trusted sellers, and a
            seamless shopping experience.
          </p>

          {/* CTA buttons */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button asChild className="rounded-full text-base" size="lg">
              <Link href="/products">
                Shop Medicines <ArrowUpRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>

            {/* <Button
              className="rounded-full text-base shadow-none"
              size="lg"
              variant="outline"
            >
              <CirclePlay className="mr-1 h-5 w-5" />
              How It Works
            </Button> */}
          </div>
        </div>

        <div className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-accent flex items-center justify-center">
          <HeroPharmacyIllustration className="h-full w-full text-foreground/90" />
        </div>
      </div>
    </section>
  );
}
