import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Order = {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
};

const orders: Order[] = [
  {
    id: 101,
    productName: "Vitamin C Tablets",
    quantity: 2,
    price: 12.99,
    status: "Delivered",
  },
  {
    id: 102,
    productName: "Pain Relief Capsules",
    quantity: 1,
    price: 8.5,
    status: "Shipped",
  },
  {
    id: 103,
    productName: "Multivitamin Gummies",
    quantity: 3,
    price: 14.99,
    status: "Processing",
  },
];

const OrdersPage = () => {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-(--breakpoint-xl) px-6">
        <h1 className="text-3xl font-bold sm:text-4xl">My Orders</h1>
        <p className="mt-2 text-foreground/80 sm:text-lg">
          Track your orders, check statuses, and view details of your Medistor
          purchases.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="rounded-lg border bg-accent/20 hover:bg-accent/30 transition-colors"
                >
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3">{order.productName}</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3">${order.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    ${(order.price * order.quantity).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "secondary"
                          : order.status === "Shipped"
                            ? "default"
                            : order.status === "Processing"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default OrdersPage;
