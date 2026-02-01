import AddToCartSection from "@/components/pages/products/productPage";

import Feature from "@/components/pages/home/feature";
import HeroSction from "@/components/pages/home/hero";
import ProductDetailsPage from "@/components/pages/products/productDetails";
import OrdersPage from "@/components/pages/order/getMyOrders";
import OrderCart from "@/components/pages/order/orderCart";
import CheckoutPage from "@/components/pages/order/checkOut";
import { serverFetch } from "@/lib/fetch/serverFetch";
import CategoryPage from "./(products)/category/page";

const HomePage = async () => {
  const data = await serverFetch("/api/auth");
  // console.log(data);
  return (
    <div>
      <HeroSction data={data} />
      <CategoryPage />
      <AddToCartSection />
      <Feature />
      <ProductDetailsPage />
      <OrdersPage />
      <OrderCart />
      <CheckoutPage />
    </div>
  );
};

export default HomePage;
