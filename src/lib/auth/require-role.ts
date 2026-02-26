"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, Role, type MeUser } from "./get-me";

export function useRequireRole(allowed: Role[]) {
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const me = await getMe();

      if (!mounted) return;

      if (!me) {
        router.replace("/login");
        return;
      }

      if (!allowed.includes(me.role)) {
        router.replace("/");
        return;
      }

      setUser(me);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [allowed, router]);

  return { user, loading };
}