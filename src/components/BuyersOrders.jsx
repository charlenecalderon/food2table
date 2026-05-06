// adding this to keep the same format as the browse page
export default function BuyersOrders({ order }) {
  const isPaid = order.status === "PLACED" || order.status === "COMPLETED";
  const total = order.items?.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0) || 0;
  const vendorProfile = order.items?.[0]?.product?.seller?.profile;
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : null;

  return (
    <div className="bg-green-200 rounded-xl w-72 p-4">
      <h2 className="text-emerald-900 font-bold font-serif mb-1">
        {order.items?.[0]?.product?.name || "Order"}
        {order.items?.length > 1 ? ` + ${order.items.length - 1} more` : ""}
      </h2>
      <div className="flex flex-col gap-1 mt-1 mb-2">
        {order.items?.map((item) => (
          <p key={item.id} className="text-emerald-900 font-serif text-sm">
            {item.product?.name} × {item.quantity}
          </p>
        ))}
      </div>
      {vendorProfile?.name && (
        <p className="text-emerald-900 font-serif text-sm">Vendor: <span className="font-bold">{vendorProfile.name}</span></p>
      )}
      {vendorProfile?.location && (
        <p className="text-emerald-900 font-serif text-sm">Pickup: <span className="font-bold">{vendorProfile.location}</span></p>
      )}
      {vendorProfile?.pickupInstructions && (
        <p className="text-emerald-900 font-serif text-sm">Instructions: {vendorProfile.pickupInstructions}</p>
      )}
      {orderDate && (
        <p className="text-emerald-900 font-serif text-sm">Ordered: {orderDate}</p>
      )}
      <div className="flex justify-between items-center mt-2">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          isPaid ? "bg-emerald-900 text-white" : "bg-white text-emerald-900"
        }`}>
          {order.status}
        </span>
        <span className="text-emerald-900 font-bold">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
