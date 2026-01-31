"use server";

import { env } from "@/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

async function getalluser() {
  const cookieStore = cookies();

  const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });
  const data = await res.json();
  console.log(data);
  return data.data;
}
export const useraction = {
  getalluser,
};
