// app/admin/users/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { clientFetch } from "./clientFetch";
interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔵 GET - সব ইউজার আনা
  const getUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await clientFetch<User[]>("/api/admin/users");
    setLoading(false);
    if (data) setUsers(data);
  }, []);

  // 🟢 POST - নতুন ইউজার তৈরি
  const createUser = async (formData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const { data, error } = await clientFetch<User>("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (error) {
      alert("তৈরি করা সম্ভব হয়নি");
      return;
    }

    if (data) {
      setUsers([...users, data]); // নতুন ইউজার যোগ
      alert("সফলভাবে তৈরি হয়েছে!");
    }
  };

  // 🟡 PUT - ইউজার আপডেট
  const updateUser = async (
    userId: string,
    formData: { name: string; email: string; role: string },
  ) => {
    const { data, error } = await clientFetch<User>(
      `/api/admin/users/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify(formData),
      },
    );

    if (error) {
      alert("আপডেট করা সম্ভব হয়নি");
      return;
    }

    if (data) {
      setUsers(users.map((u) => (u.id === userId ? data : u))); // আপডেট করা
      alert("সফলভাবে আপডেট হয়েছে!");
    }
  };

  // 🔴 DELETE - ইউজার ডিলিট
  const deleteUser = async (userId: string) => {
    if (!confirm("আপনি কি নিশ্চিত?")) return;

    const { error } = await clientFetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    if (error) {
      alert("ডিলিট করা সম্ভব হয়নি");
      return;
    }

    setUsers(users.filter((u) => u.id !== userId)); // লিস্ট থেকে সরানো
    alert("সফলভাবে ডিলিট হয়েছে!");
  };

  // Initial load
  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, []);

  // 🎯 এখানে UI থাকবে (functions এর উপরে focus)
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">ইউজার ম্যানেজমেন্ট</h1>

      {/* Example: Create button */}
      <button
        onClick={() =>
          createUser({
            name: "নতুন ইউজার",
            email: "test@example.com",
            password: "123456",
            role: "user",
          })
        }
        className="bg-blue-600 text-white px-4 py-2 rounded mb-5"
      >
        নতুন ইউজার তৈরি
      </button>

      {/* Users table */}
      {loading ? (
        <div>লোড হচ্ছে...</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border p-2">নাম</th>
              <th className="border p-2">ইমেইল</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  {/* Update button */}
                  <button
                    onClick={() =>
                      updateUser(user.id, {
                        name: user.name + " (Updated)",
                        email: user.email,
                        role: user.role,
                      })
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    এডিট
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    ডিলিট
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
