import { env } from "@/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

const userController = {
  getCurrentUser: async () => {
    const cookieStore = await cookies();
    const allCookie = cookieStore.toString();
    // console.log(allCookie);

    const res = await fetch(`${BACKEND_URL}/api/auth`, {
      method: "GET",
      headers: {
        Cookie: allCookie,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // console.log(data);
    return data;
  },
};

export default userController;
