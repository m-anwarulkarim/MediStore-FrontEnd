import AdminPage from "@/components/admin/page";
import React, { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <AdminPage />
      {children}
    </div>
  );
};

export default AdminLayout;
