import React, { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div>admin dashboard layout </div>
      {children}
    </div>
  );
};

export default AdminLayout;
