export default function BuyersOrders({ order }) {
  const total = order.items?.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0) || 0;
  const vendorProfile = order.items?.[0]?.product?.seller?.profile;

  return (
    <div className="bg-green-200 rounded-xl p-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-emerald-900">
          {order.status}
        </span>
        <p className="text-emerald-700 text-xs">
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-3">
        <p className="text-emerald-900 font-bold font-serif">
          Vendor: {vendorProfile?.name || "Unknown"}
        </p>
        {vendorProfile?.location && (
          <p className="text-emerald-800 text-sm">Pickup: {vendorProfile.location}</p>
        )}
        {vendorProfile?.pickupInstructions && (
          <p className="text-emerald-800 text-sm">{vendorProfile.pickupInstructions}</p>
        )}
      </div>

      <div className="mt-3">
        <p className="text-emerald-900 font-serif text-sm font-bold mb-1">Items:</p>
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-emerald-900">
            <span>{item.product?.name}</span>
            <span>x{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-right">
        <span className="text-emerald-900 font-bold">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
