"use client";
import { useState } from "react";

// Placeholder cart data (will connect to backend later)
const initialCart = [
  {
    id: 1,
    name: "Heirloom Tomatoes",
    vendor: "Sunrise Valley Farm",
    price: 3.50,
    unit: "lb",
    qty: 2,
    pickupWindows: ["Mon 8am–12pm", "Wed 2pm–6pm", "Sat 7am–11am"],
    pickupLocation: "Riverside, CA — Oak St. side gate",
    pickupInstructions: "Text us when you arrive — use the side gate on Oak St.",
  },
  {
    id: 2,
    name: "Free-Range Eggs",
    vendor: "Sunrise Valley Farm",
    price: 6.00,
    unit: "dozen",
    qty: 1,
    pickupWindows: ["Mon 8am–12pm", "Wed 2pm–6pm", "Sat 7am–11am"],
    pickupLocation: "Riverside, CA — Oak St. side gate",
    pickupInstructions: "Text us when you arrive — use the side gate on Oak St.",
  },
  {
    id: 3,
    name: "Wildflower Honey",
    vendor: "Blue Ridge Apiaries",
    price: 12.00,
    unit: "jar",
    qty: 1,
    pickupWindows: ["Tue 10am–2pm", "Fri 3pm–7pm"],
    pickupLocation: "Corona, CA — Farmer's Market Booth 14",
    pickupInstructions: "Look for the blue banner. Parking is free in the adjacent lot.",
  },
];

function groupByVendor(cart) {
  return cart.reduce((acc, item) => {
    if (!acc[item.vendor]) acc[item.vendor] = [];
    acc[item.vendor].push(item);
    return acc;
  }, {});
}

export default function CheckoutPage() {
  const [cart, setCart] = useState(initialCart);
  const [step, setStep] = useState(1);
  const [pickupSelections, setPickupSelections] = useState({});
  const [placed, setPlaced] = useState(false);

  const grouped = groupByVendor(cart);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const canProceed = Object.keys(grouped).every((v) => pickupSelections[v]);

  const updateQty = (id, delta) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));

  const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id));

  // Success Screen
  if (placed) {
    return (
      <div className="bg-emerald-50 min-h-screen p-6">
        <div className="bg-green-200 rounded-xl p-10 max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-serif font-bold text-emerald-900 mb-2">Order Placed!</h1>
          <p className="text-emerald-900 font-serif text-sm mb-6">
            Your reservation is confirmed! Check your Orders page to track your pickup.
          </p>
          <div className="bg-emerald-50 rounded-xl p-4 text-left mb-6">
            {Object.entries(grouped).map(([vendor]) => (
              <div key={vendor} className="mb-2">
                <p className="font-bold text-emerald-900 text-sm">{vendor}</p>
                <p className="text-emerald-900 font-serif text-xs">Pickup: {pickupSelections[vendor]}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setPlaced(false); setStep(1); setCart(initialCart); setPickupSelections({}); }}
            className="bg-emerald-900 hover:bg-emerald-700 text-white px-8 py-2 rounded-full font-bold"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 min-h-screen p-6">

      {/* Step Indicators */}
      <div className="flex items-center gap-3 mb-6 max-w-4xl mx-auto flex-wrap">
        {["Cart", "Pickup", "Confirm"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
              ${step > i + 1 ? "bg-emerald-900 text-white" :
                step === i + 1 ? "bg-emerald-900 text-white ring-4 ring-emerald-200" :
                "bg-green-200 text-emerald-900"}`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`font-serif font-bold text-sm ${step >= i + 1 ? "text-emerald-900" : "text-emerald-400"}`}>
              {label}
            </span>
            {i < 2 && <div className={`w-8 h-1 rounded ${step > i + 1 ? "bg-emerald-900" : "bg-green-200"}`} />}
          </div>
        ))}
      </div>

      {/* STEP 1: Cart */}
      {step === 1 && (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <h1 className="text-2xl font-serif font-bold text-emerald-900">Your Cart</h1>

          {cart.length === 0 && (
            <p className="text-emerald-900 font-serif text-sm">Your cart is empty.</p>
          )}

          {cart.map((item) => (
            <div key={item.id} className="bg-green-200 rounded-xl p-4 flex flex-col gap-2">
              <p className="text-lg font-serif font-bold text-emerald-900">{item.name}</p>
              <p className="text-emerald-900 font-bold">${item.price.toFixed(2)} / {item.unit}</p>
              <p className="text-emerald-900 font-serif text-sm">Quantity: {item.qty}</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => updateQty(item.id, 1)}
                  className="bg-emerald-900 hover:bg-emerald-700 text-white px-4 py-1 rounded-full font-bold"
                >+</button>
                <button
                  onClick={() => updateQty(item.id, -1)}
                  className="bg-emerald-900 hover:bg-emerald-700 text-white px-4 py-1 rounded-full font-bold"
                >-</button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded-full font-bold"
                >Remove</button>
              </div>
            </div>
          ))}

          {cart.length > 0 && (
            <>
              <div className="bg-green-200 rounded-xl p-4">
                <p className="text-emerald-900 font-serif text-sm">Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span></p>
                <p className="text-emerald-900 font-serif text-sm">Pickup fee: <span className="font-bold">Free</span></p>
                <p className="font-serif font-bold text-emerald-900 text-lg mt-2">Total: ${subtotal.toFixed(2)}</p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="bg-emerald-900 hover:bg-emerald-700 text-white px-8 py-2 rounded-full font-bold w-fit"
              >
                Continue to Pickup →
              </button>
            </>
          )}
        </div>
      )}

      {/* STEP 2: Pickup */}
      {step === 2 && (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <h1 className="text-2xl font-serif font-bold text-emerald-900">Choose Pickup Times</h1>
          <p className="text-emerald-900 font-serif text-sm">Select a pickup window for each vendor.</p>

          {Object.entries(grouped).map(([vendor, items]) => (
            <div key={vendor} className="bg-green-200 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-lg font-serif font-bold text-emerald-900">{vendor}</p>
              <p className="text-emerald-900 text-sm">📍 {items[0].pickupLocation}</p>

              <div className="flex flex-wrap gap-2">
                {items.map((i) => (
                  <span key={i.id} className="bg-emerald-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {i.name} ×{i.qty}
                  </span>
                ))}
              </div>

              <div className="bg-emerald-50 rounded-xl p-3 text-sm text-emerald-900 font-serif">
                📍 {items[0].pickupInstructions}
              </div>

              <p className="font-bold text-emerald-900 text-sm">Select a window:</p>
              <div className="flex flex-wrap gap-2">
                {items[0].pickupWindows.map((w) => (
                  <button
                    key={w}
                    onClick={() => setPickupSelections((s) => ({ ...s, [vendor]: w }))}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition
                      ${pickupSelections[vendor] === w
                        ? "bg-emerald-900 text-white"
                        : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"}`}
                  >
                    🕐 {w}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setStep(1)}
              className="bg-green-200 text-emerald-900 px-6 py-2 rounded-full font-bold hover:bg-green-300"
            >← Back</button>
            <button
              onClick={() => setStep(3)}
              disabled={!canProceed}
              className={`px-8 py-2 rounded-full font-bold transition
                ${canProceed ? "bg-emerald-900 hover:bg-emerald-700 text-white" : "bg-green-200 text-emerald-400 cursor-not-allowed"}`}
            >
              {canProceed ? "Review Order →" : "Select all pickup windows first"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Confirm */}
      {step === 3 && (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <h1 className="text-2xl font-serif font-bold text-emerald-900">Review & Confirm</h1>

          {Object.entries(grouped).map(([vendor, items]) => (
            <div key={vendor} className="bg-green-200 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="text-lg font-serif font-bold text-emerald-900">{vendor}</p>
                  <p className="text-emerald-900 text-sm">📍 {items[0].pickupLocation}</p>
                </div>
                <span className="bg-emerald-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                  🕐 {pickupSelections[vendor]}
                </span>
              </div>
              {items.map((i) => (
                <div key={i.id} className="flex justify-between gap-3">
                  <div>
                    <p className="font-bold text-emerald-900 font-serif">{i.name}</p>
                    <p className="text-emerald-900 font-serif text-sm">×{i.qty} {i.unit}</p>
                  </div>
                  <p className="font-bold text-emerald-900">${(i.price * i.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          ))}

          <div className="bg-green-200 rounded-xl p-4">
            <p className="text-emerald-900 font-serif text-sm">Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span></p>
            <p className="text-emerald-900 font-serif text-sm">Pickup fee: <span className="font-bold">Free</span></p>
            <p className="font-serif font-bold text-emerald-900 text-lg mt-2">Total: ${subtotal.toFixed(2)}</p>
          </div>

          <p className="text-emerald-900 font-serif text-sm">
            💡 Payment is collected at pickup. Your order will show as Pending until the vendor confirms.
          </p>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setStep(2)}
              className="bg-green-200 text-emerald-900 px-6 py-2 rounded-full font-bold hover:bg-green-300"
            >← Back</button>
            <button
              onClick={() => setPlaced(true)}
              className="bg-emerald-900 hover:bg-emerald-700 text-white px-8 py-2 rounded-full font-bold"
            >
              Place Order 🌿
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
