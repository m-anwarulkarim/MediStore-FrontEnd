import MedicineCard from "@/components/products/productPage";
import { serverFetch } from "@/lib/fetch/serverFetch";
import React from "react";

const MedicinesPage = async () => {
  const response = await serverFetch("/api/medicines", {
    method: "GET",
    cache: "no-store",
  });

  const medicines = response?.data.data || [];

  return (
    <div>
      <MedicineCard medicines={medicines} />
    </div>
  );
};

export default MedicinesPage;
