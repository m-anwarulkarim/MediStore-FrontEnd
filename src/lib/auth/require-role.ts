import { redirect } from "next/navigation";
import { getMe, Role } from "./get-me";
export async function requireRole(allowed: Role[]) {
  const user = await getMe();

  if (!user) redirect("/login");

  if (!allowed.includes(user.role)) {
    redirect("/");
  }

  return user;
}
