export default function BuyersOrders({ order }) {
  // Placeholder Logic of order statuses and such to determine color based on status/urgency
  const isPaid = order.status === "PAID";
  const isUrgent = order.timeLeft && order.timeLeft <= 12;
  
  return (
    <div className={`bg-white border-2 rounded-2xl p-5 shadow-sm transition-all ${
      isPaid ? 'border-emerald-100' : isUrgent ? 'border-red-100 shadow-md' : 'border-slate-100'
    }`}>
      
      {/* Header: Title, Price, and Status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{order.itemName}</h3>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            {order.vendorName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-emerald-700">${order.price.toFixed(2)}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Conditional Info Area (Urgency or Payment Info) */}
      <div className="mt-2">
        {order.timeLeft ? (
          <div className={`p-3 rounded-xl border ${isUrgent ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
            <p className={`text-sm font-bold ${isUrgent ? 'text-red-700' : 'text-orange-800'}`}>
              {isPaid ? "✅ Pickup within:" : "⚠️ Reserve expires in:"} {order.timeLeft} hours
            </p>
          </div>
        ) : (
          <p className="text-slate-400 text-[10px] italic">No time limit on this reserve</p>
        )}
      </div>

      {/* Payment Section (Hidden if already paid) */}
      {!isPaid && (
        <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
          <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Preferred Payment:</p>
          <p className="text-sm font-bold text-slate-700">
            {order.paymentType === "CASH" ? " Cash on Delivery" : "Digital (Venmo/Zelle)"}
          </p>
        </div>
      )}
    </div>
  );
}