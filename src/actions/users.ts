// actions/users.ts
"use server";

import { serverFetch } from "@/lib/fetch/serverFetch";
import { revalidatePath } from "next/cache";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

// 🔵 GET - সব ইউজার আনা
export async function getUsers() {
  const { data, error } = await serverFetch<User[]>("/api/admin/users");

  if (error) {
    return { users: [], error: error.message };
  }

  return { users: data || [], error: null };
}

// 🔵 GET - একটি ইউজার আনা
export async function getUserById(userId: string) {
  const { data, error } = await serverFetch<User>(`/api/admin/users/${userId}`);

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data, error: null };
}

// 🟢 POST - নতুন ইউজার তৈরি
export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const { data, error } = await serverFetch<User>("/api/admin/users", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });

  if (error) {
    return { success: false, message: error.message || "তৈরি করা সম্ভব হয়নি" };
  }

  revalidatePath("/admin/users"); // পেজ রিফ্রেশ
  return { success: true, message: "সফলভাবে তৈরি হয়েছে!", user: data };
}

// 🟡 PUT - ইউজার আপডেট
export async function updateUser(userId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  const { data, error } = await serverFetch<User>(
    `/api/admin/users/${userId}`,
    {
      method: "PUT",
      body: JSON.stringify({ name, email, role }),
    },
  );

  if (error) {
    return {
      success: false,
      message: error.message || "আপডেট করা সম্ভব হয়নি",
    };
  }

  revalidatePath("/admin/users");
  return { success: true, message: "সফলভাবে আপডেট হয়েছে!", user: data };
}

// 🔴 DELETE - ইউজার ডিলিট
export async function deleteUser(userId: string) {
  const { error } = await serverFetch(`/api/admin/users/${userId}`, {
    method: "DELETE",
  });

  if (error) {
    return {
      success: false,
      message: error.message || "ডিলিট করা সম্ভব হয়নি",
    };
  }

  revalidatePath("/admin/users");
  return { success: true, message: "সফলভাবে ডিলিট হয়েছে!" };
}
