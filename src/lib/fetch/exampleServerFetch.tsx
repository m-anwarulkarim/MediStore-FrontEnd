/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/users/page.tsx

import DeleteButton from "./exampleClientFetch";
import { serverFetch } from "./serverFetch";

export default async function AdminUsersPage() {
  // ১. সার্ভার ফেচ ব্যবহার করে ডাটা আনা
  const { data: users, error } = await serverFetch("/api/admin/users");

  if (error) return <div>ভুল হয়েছে: {JSON.stringify(error)}</div>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">ইউজার লিস্ট (Admin)</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border p-2">নাম</th>
            <th className="border p-2">ইমেইল</th>
            <th className="border p-2">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: any) => (
            <tr key={user.id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                {/* ২. ক্লায়েন্ট কম্পোনেন্ট যেখানে ডিলিট লজিক আছে */}
                <DeleteButton userId={user.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
