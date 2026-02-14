import { serverFetch } from "@/lib/fetch/serverFetch";

export type Role = "ADMIN" | "SELLER" | "CUSTOMER";

export type MeUser = {
  id: string;
  name?: string | null;
  email: string;
  role: Role;
  status?: "ACTIVE" | "BANNED" | "SUSPENDED";
};

export async function getMe(): Promise<MeUser | null> {
  const res = await serverFetch<{ success: boolean; data: MeUser }>(
    "api/auth",
    {
      method: "GET",
    },
  );

  return res.data?.data ?? null;
}
