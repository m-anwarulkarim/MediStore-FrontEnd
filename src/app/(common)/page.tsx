/* eslint-disable @typescript-eslint/no-explicit-any */
import Feature from "@/components/pages/home/feature";
import HeroSction from "@/components/pages/home/hero";
import CategoryPage from "./(products)/category/page";
import MedicinesPage from "./(products)/medicines/page";

const HomePage = async () => {
  return (
    <div className="min-h-screen">
      <HeroSction />
      <CategoryPage />

      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8"></div>

        <MedicinesPage />
      </section>
      <Feature />
    </div>
  );
};

export default HomePage;
