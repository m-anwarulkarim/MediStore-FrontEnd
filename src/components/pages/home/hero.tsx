import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HeroSction({ data }) {
  // console.log(data);
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) gap-12 px-6 py-12 lg:grid-cols-2">
        <div>
          <Badge
            asChild
            className="rounded-full border-border py-1"
            variant="secondary"
          >
            <Link href="#">
              Now Live! Medistor v1.0 <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </Badge>
          <h1 className="mt-6 max-w-[17ch] font-semibold text-4xl leading-[1.2]! tracking-[-0.035em] md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]">
            Your Trusted Online Medicine Store
          </h1>
          <p className="mt-6 max-w-[60ch] text-foreground/80 sm:text-lg">
            Medistor brings all your healthcare needs to one place. Browse
            medicines, wellness products, and healthcare essentials with ease.
            Fast delivery, trusted brands, and a seamless shopping experience.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <Button className="rounded-full text-base" size="lg">
              Shop Now <ArrowUpRight className="h-5! w-5!" />
            </Button>
            <Button
              className="rounded-full text-base shadow-none"
              size="lg"
              variant="outline"
            >
              <CirclePlay className="h-5! w-5!" /> Watch How It Works
            </Button>
          </div>
        </div>
        <div className="aspect-video w-full rounded-xl bg-accent" />
      </div>
    </div>
  );
}
