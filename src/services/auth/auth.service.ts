import { clientFetch } from "@/lib/fetch/clientFetch";

export const authService = {
  logout: async () => {
    return clientFetch("api/users/logout", { method: "POST" });
  },

  me: async () => {
    return clientFetch("api/auth", { method: "GET" });
  },
};
