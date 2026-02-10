/* eslint-disable @typescript-eslint/no-explicit-any */
import HeroSction from "@/components/pages/home/hero";
import HomeCategoriesSection from "@/components/pages/home/home-categories-section";
import HomeFlashSaleSection from "@/components/pages/home/home-flash-sale-section";
import HomeMedicinesSection from "@/components/pages/home/home-medicines-section";

const HomePage = async () => {
  return (
    <div className="min-h-screen">
      <HeroSction />
      <HomeCategoriesSection />
      <HomeFlashSaleSection />
      <HomeMedicinesSection />
    </div>
  );
};

export default HomePage;
