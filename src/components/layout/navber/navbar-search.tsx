"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type NavbarSearchProps = {
  className?: string;
  placeholder?: string;
};

export function NavbarSearch({
  className,
  placeholder = "Search medicines…",
}: NavbarSearchProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const initial = useMemo(() => sp.get("search") ?? "", [sp]);
  const [q, setQ] = useState(initial);

  const go = () => {
    const query = new URLSearchParams(sp.toString());
    if (q.trim()) query.set("search", q.trim());
    else query.delete("search");

    // সবসময় products page-এ নিয়ে গিয়ে search করাবে
    router.push(`/products?${query.toString()}`);
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") go();
            }}
            placeholder={placeholder}
            className="pl-9"
          />
        </div>
        <Button onClick={go} variant="outline" className="shrink-0">
          Search
        </Button>
      </div>
    </div>
  );
}
