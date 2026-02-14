/* eslint-disable @typescript-eslint/no-explicit-any */
import MedicineCard from "@/components/products/productPage";
import { serverFetch } from "@/lib/fetch/serverFetch";

const MedicinesPage = async () => {
  const response = await serverFetch("api/medicines", {
    method: "GET",
    cache: "no-store",
  });

  const medicines = response?.data?.data || [];

  const listKey = medicines.map((m: any) => String(m.id)).join("-");

  return (
    <div>
      <MedicineCard key={listKey} medicines={medicines} />
    </div>
  );
};

export default MedicinesPage;
