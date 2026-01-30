/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { cookies } from "next/headers";
import { env } from "@/env";

const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token");

  return {
    "Content-Type": "application/json",
    Cookie: `better-auth.session_token=${sessionToken?.value}`,
  };
}

// Get all users
export async function getAllUsers() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
      headers: await getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        message: data.message || "Failed to fetch users",
      };
    }

    const data = await response.json();
    console.log(data);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

// Update user status
export async function updateUserStatus(userId: string, status: any) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ status }),
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        message: data.message || "Failed to update user",
      };
    }

    const data = await response.json();
    return { success: true, data, message: "User updated successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

// Delete user
export async function deleteUser(userId: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        message: data.message || "Failed to delete user",
      };
    }

    return { success: true, message: "User deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

// Get all orders (admin)
export async function getAllOrders() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/orders/admin/all`, {
      headers: await getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        message: data.message || "Failed to fetch orders",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

// Get all categories
export async function getAllCategories() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/categories`, {
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        message: data.message || "Failed to fetch categories",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

// Create category
export async function createCategory(formData: {
  name: string;
  description?: string;
}) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/categories`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(formData),
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        message: data.message || "Failed to create category",
      };
    }

    const data = await response.json();
    return { success: true, data, message: "Category created successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

// Update category
export async function updateCategory(
  categoryId: string,
  formData: { name: string; description?: string },
) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/categories/${categoryId}`,
      {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify(formData),
        credentials: "include",
      },
    );

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        message: data.message || "Failed to update category",
      };
    }

    const data = await response.json();
    return { success: true, data, message: "Category updated successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

// Delete category
export async function deleteCategory(categoryId: string) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/categories/${categoryId}`,
      {
        method: "DELETE",
        headers: await getAuthHeaders(),
        credentials: "include",
      },
    );

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        message: data.message || "Failed to delete category",
      };
    }

    return { success: true, message: "Category deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}
