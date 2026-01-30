import AddToCartSection from "@/components/pages/products/productPage";
import CetagoryPage from "@/components/pages/home/cetagory";
import Feature from "@/components/pages/home/feature";

import HeroSction from "@/components/pages/home/hero";
import ProductDetailsPage from "@/components/pages/products/productDetails";
import OrdersPage from "@/components/pages/order/getMyOrders";
import OrderCart from "@/components/pages/order/orderCart";
import CheckoutPage from "@/components/pages/order/checkOut";

const HomePage = () => {
  return (
    <div>
      <HeroSction />
      <CetagoryPage />
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
