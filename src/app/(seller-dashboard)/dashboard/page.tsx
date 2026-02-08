import SellerDashboardCart from "@/components/seller/sellerDashboardCategorycart";
import React from "react";
import MedicineInventoryGrid from "@/components/seller/sellerDashboardMedicineCart";

const SellerDashbordPage = () => {
  return (
    <div>
      <SellerDashboardCart />
      <MedicineInventoryGrid />
    </div>
  );
};

export default SellerDashbordPage;
