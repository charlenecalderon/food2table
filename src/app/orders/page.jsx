import NavBar from "../../components/NavBar";
import OrderCard from "../../components/BuyersOrders";

export default function OrdersPage() {
  // PRISMA PLACEHOLDER
  const sampleOrders = [
    { id: 1, itemName: "Milk", vendorName: "Dairy Co", price: 2.49, status: "PAID", timeLeft: 24, paymentType: "DIGITAL" },
    { id: 2, itemName: "Apple Bag", vendorName: "Orchard", price: 4.50, status: "UNPAID", timeLeft: null, paymentType: "CASH" },
    { id: 3, itemName: "Sourdough Bread", vendorName: "Baker", price: 5.00, status: "UNPAID", timeLeft: 12, paymentType: "DIGITAL" },
  ];

  return (
    <div className="min-h-screen bg-[#f0fff4]">
      <NavBar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-emerald-900 mb-8">My Orders</h1>
        
        <div className="grid gap-6">
          {sampleOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </main>
    </div>
  );
}