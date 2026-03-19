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
    img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&q=80",
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
    img: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=200&q=80",
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
    img: "https://images.unsplash.com/photo-1587049332298-1c42e83937a7?w=200&q=80",
    pickupWindows: ["Tue 10am–2pm", "Fri 3pm–7pm"],
    pickupLocation: "Corona, CA — Farmer's Market Booth 14",
    pickupInstructions: "Look for the blue banner. Parking is free in the adjacent lot.",
  },
];

// Group cart items by vendor
function groupByVendor(cart) {
  return cart.reduce((acc, item) => {
    if (!acc[item.vendor]) acc[item.vendor] = [];
    acc[item.vendor].push(item);
    return acc;
  }, {});
}

export default function CheckoutPage() {
  const [cart, setCart] = useState(initialCart);
  const [step, setStep] = useState(1); // 1 = Cart, 2 = Pickup, 3 = Confirm
  const [pickupSelections, setPickupSelections] = useState({});
  const [placed, setPlaced] = useState(false);

  const grouped = groupByVendor(cart);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const canProceed = Object.keys(grouped).every((v) => pickupSelections[v]);

  const updateQty = (id, delta) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));

  const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id));

  // ── Success Screen ──────────────────────────────────────────────────────
  if (placed) {
    return (
      <div className="bg-emerald-50 min-h-screen w-screen flex items-center justify-center">
        <div className="bg-green-200 rounded-xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-emerald-900 font-bold font-serif text-2xl mb-2">Order Placed!</h1>
          <p className="text-emerald-800 text-sm font-serif mb-6">
            Your reservation is confirmed! Check your Orders page to track your pickup.
          </p>
          <div className="bg-emerald-100 rounded-xl p-4 text-left mb-6 space-y-2">
            {Object.entries(grouped).map(([vendor, items]) => (
              <div key={vendor}>
                <p className="text-emerald-900 font-bold text-sm">{vendor}</p>
                <p className="text-emerald-700 text-xs">Pickup: {pickupSelections[vendor]}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setPlaced(false); setStep(1); setCart(initialCart); setPickupSelections({}); }}
            className="bg-emerald-900 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-full"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 min-h-screen w-screen">

      {/* Header */}
      <div className="w-screen h-60">
        <img
          className="w-screen h-60 object-cover"
          src="https://thumbs.dreamstime.com/b/day-life-pixelated-farm-dive-vibrant-world-charming-pixel-art-where-characters-tend-to-their-crops-332448133.jpg"
          alt="banner"
        />
      </div>

      {/* Navbar */}
      <div className="flex justify-between items-center w-screen p-4 bg-green-200">
        <div className="flex w-1/3"></div>
        <div className="w-1/3 justify-center items-center flex">
          <span className="text-3xl font-serif font-bold text-center mt-4 text-emerald-900">
            fresh2table
          </span>
        </div>
        <div className="flex justify-end w-1/3">
          <button className="bg-emerald-800 rounded-full mt-3 ml-4 w-12 h-12 items-center flex justify-center">
            <img
              className="rounded-full w-10 h-10 m-1"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyzTWQoCUbRNdiyorem5Qp1zYYhpliR9q0Bw&s"
              alt="profile"
            />
          </button>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="flex justify-between items-center w-full p-4">
        <div className="flex w-1/6">
          <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-full mt-4 ml-4 h-20 w-40">
            Browse
          </button>
        </div>
        <div className="flex w-1/6 justify-center">
          <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-full mt-4 ml-4 h-20 w-40">
            Cart
          </button>
        </div>
        <div className="flex w-1/6 justify-end p-1">
          <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-full mt-4 ml-4 h-20 w-40">
            Orders
          </button>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="p-6 max-w-3xl mx-auto">

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {["Cart", "Pickup", "Confirm"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${step > i + 1 ? "bg-emerald-900 text-white" :
                  step === i + 1 ? "bg-emerald-900 text-white ring-4 ring-emerald-300" :
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

        {/* ── STEP 1: Cart ── */}
        {step === 1 && (
          <div className="space-y-4">
            <h1 className="text-emerald-900 font-bold font-serif text-2xl">Your Cart</h1>

            {cart.length === 0 && (
              <p className="text-emerald-700 font-serif text-center py-12">Your cart is empty.</p>
            )}

            {cart.map((item) => (
              <div key={item.id} className="bg-green-200 rounded-xl p-4 flex gap-4 items-center">
                <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-emerald-900 font-bold font-serif">{item.name}</p>
                  <p className="text-emerald-700 text-xs">{item.vendor}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-white rounded-full overflow-hidden">
                      <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 text-emerald-900 font-bold hover:bg-emerald-100">−</button>
                      <span className="px-3 font-bold text-emerald-900">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, +1)} className="px-3 py-1 text-emerald-900 font-bold hover:bg-emerald-100">+</button>
                    </div>
                    <span className="text-emerald-700 text-xs">{item.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-900 font-bold">${(item.price * item.qty).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:text-red-700 mt-1">
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {cart.length > 0 && (
              <>
                <div className="bg-green-200 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-emerald-800 text-sm font-serif">
                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 text-sm font-serif">
                    <span>Pickup fee</span><span>Free</span>
                  </div>
                  <div className="flex justify-between text-emerald-900 font-bold font-serif border-t border-emerald-300 pt-2">
                    <span>Total</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => setStep(2)}
                  className="w-full bg-emerald-900 hover:bg-emerald-700 text-white font-bold py-3 rounded-full">
                  Continue to Pickup →
                </button>
              </>
            )}
          </div>
        )}

        {/* ── STEP 2: Pickup ── */}
        {step === 2 && (
          <div className="space-y-4">
            <h1 className="text-emerald-900 font-bold font-serif text-2xl">Choose Pickup Times</h1>
            <p className="text-emerald-700 font-serif text-sm">Select a pickup window for each vendor.</p>

            {Object.entries(grouped).map(([vendor, items]) => (
              <div key={vendor} className="bg-green-200 rounded-xl p-5 space-y-3">
                <p className="text-emerald-900 font-bold font-serif text-lg">{vendor}</p>
                <p className="text-emerald-700 text-xs">📍 {items[0].pickupLocation}</p>

                <div className="flex flex-wrap gap-2 text-xs">
                  {items.map((i) => (
                    <span key={i.id} className="bg-emerald-900 text-white px-3 py-1 rounded-full font-bold">
                      {i.name} ×{i.qty}
                    </span>
                  ))}
                </div>

                <div className="bg-emerald-100 rounded-xl p-3 text-sm text-emerald-800 font-serif">
                  📍 {items[0].pickupInstructions}
                </div>

                <p className="text-emerald-900 font-bold text-sm">Select a window:</p>
                <div className="flex flex-wrap gap-2">
                  {items[0].pickupWindows.map((w) => (
                    <button key={w} onClick={() => setPickupSelections((s) => ({ ...s, [vendor]: w }))}
                      className={`px-4 py-2 rounded-full font-bold text-sm transition
                        ${pickupSelections[vendor] === w
                          ? "bg-emerald-900 text-white"
                          : "bg-white text-emerald-900 hover:bg-emerald-100"}`}>
                      🕐 {w}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="px-6 py-3 rounded-full border-2 border-emerald-900 text-emerald-900 font-bold hover:bg-green-200">
                ← Back
              </button>
              <button onClick={() => setStep(3)} disabled={!canProceed}
                className={`flex-1 py-3 rounded-full font-bold transition
                  ${canProceed ? "bg-emerald-900 hover:bg-emerald-700 text-white" : "bg-green-200 text-emerald-400 cursor-not-allowed"}`}>
                {canProceed ? "Review Order →" : "Select all pickup windows first"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm ── */}
        {step === 3 && (
          <div className="space-y-4">
            <h1 className="text-emerald-900 font-bold font-serif text-2xl">Review & Confirm</h1>

            {Object.entries(grouped).map(([vendor, items]) => (
              <div key={vendor} className="bg-green-200 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-900 font-bold font-serif text-lg">{vendor}</p>
                    <p className="text-emerald-700 text-xs">📍 {items[0].pickupLocation}</p>
                  </div>
                  <span className="bg-emerald-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                    🕐 {pickupSelections[vendor]}
                  </span>
                </div>
                {items.map((i) => (
                  <div key={i.id} className="flex items-center gap-3">
                    <img src={i.img} alt={i.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-emerald-900 font-bold font-serif text-sm">{i.name}</p>
                      <p className="text-emerald-700 text-xs">×{i.qty} {i.unit}</p>
                    </div>
                    <p className="text-emerald-900 font-bold">${(i.price * i.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ))}

            <div className="bg-green-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-emerald-800 font-serif text-sm">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-serif text-sm">
                <span>Pickup fee</span><span>Free</span>
              </div>
              <div className="flex justify-between text-emerald-900 font-bold font-serif border-t border-emerald-300 pt-2">
                <span>Total</span><span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-emerald-100 rounded-xl p-3 text-sm text-emerald-800 font-serif">
              💡 Payment is collected at pickup. Your order will show as Pending until the vendor confirms.
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="px-6 py-3 rounded-full border-2 border-emerald-900 text-emerald-900 font-bold hover:bg-green-200">
                ← Back
              </button>
              <button onClick={() => setPlaced(true)}
                className="flex-1 py-3 bg-emerald-900 hover:bg-emerald-700 text-white rounded-full font-bold">
                Place Order 🌿
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
