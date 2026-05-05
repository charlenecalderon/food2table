export default function BuyersOrders({ order }) {
  const isPaid = order.status === "PLACED" || order.status === "COMPLETED";

  return (
    <div className="bg-green-200 text-white rounded-xl w-72 p-4">
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-emerald-900 font-bold font-serif">{order.itemName || `Order`}</h2>
        <span className="text-emerald-900 font-bold">
          ${order.items?.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0).toFixed(2) || "0.00"}
        </span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          isPaid ? "bg-emerald-900 text-white" : "bg-white text-emerald-900"
        }`}>
          {order.status}
        </span>
      </div>
    </div>
  );
}