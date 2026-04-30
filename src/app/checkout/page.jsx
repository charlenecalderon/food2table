"use client";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001";

function groupByVendor(items) {
  return items.reduce((acc, item) => {
    const vendorId = item.product?.sellerId || "Unknown Vendor";
    if (!acc[vendorId]) acc[vendorId] = [];
    acc[vendorId].push(item);
    return acc;
  }, {});
}

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [pickupSelections, setPickupSelections] = useState({});
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // Get price for a product by matching to listings
  const getPriceForProduct = (productId) => {
    for (const listing of listings) {
      // listings API returns sellerId - we match by checking if product is in any listing
      if (listing.price) return listing.price;
    }
    return 0;
  };

  // Get item price
  const getItemPrice = (item) => {
    // Try to find a listing that matches this product's seller
    const matchedListing = listings.find(
      (l) => l.sellerId === item.product?.sellerId
    );
    return matchedListing?.price || 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError("You must be logged in to view your cart.");
          setLoading(false);
          return;
        }

        // Fetch cart and listings at the same time
        const [cartRes, listingsRes] = await Promise.all([
          fetch(`${API_URL}/carts/current`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/listings`),
        ]);

        // Handle cart
        if (cartRes.status === 404) {
          setCart({ items: [] });
        } else if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCart(cartData.currentCart);
        } else {
          throw new Error("Failed to fetch cart");
        }

        // Handle listings
        if (listingsRes.ok) {
          const listingsData = await listingsRes.json();
          setListings(listingsData.listings || []);
        }

      } catch (err) {
        setError("Could not load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + getItemPrice(i) * i.quantity, 0);
  const grouped = groupByVendor(items);
  const canProceed = Object.keys(grouped).every((v) => pickupSelections[v]);

  // Reserve cart
  const handleReserve = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/carts/reserve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to reserve cart");
      const data = await res.json();
      setCart(data.reservedCart);
      setStep(3);
    } catch (err) {
      setError("Could not reserve cart. Please try again.");
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    try {
      setPlacing(true);
      const token = getToken();
      const res = await fetch(`${API_URL}/orders/${cart.id}/place`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to place order");
      setPlaced(true);
    } catch (err) {
      setError("Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-emerald-50 min-h-screen p-6 flex items-center justify-center">
        <p className="text-emerald-900 font-serif text-lg">Loading your cart...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-emerald-50 min-h-screen p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto">
          <p className="text-red-700 font-bold">Error</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Success screen
  if (placed) {
    return (
      <div className="bg-emerald-50 min-h-screen p-6">
        <div className="bg-green-200 rounded-xl p-10 max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-serif font-bold text-emerald-900 mb-2">Order Placed!</h1>
          <p className="text-emerald-900 font-serif text-sm mb-6">
            Your reservation is confirmed! Check your Orders page to track your pickup.
          </p>
          <a href="/orders" className="bg-emerald-900 hover:bg-emerald-700 text-white px-8 py-2 rounded-full font-bold inline-block">
            View Orders
          </a>
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

          {items.length === 0 && (
            <div className="bg-green-200 rounded-xl p-6 text-center">
              <p className="text-emerald-900 font-serif">Your cart is empty.</p>
              <a href="/browse" className="bg-emerald-900 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-bold inline-block mt-4">
                Browse Products
              </a>
            </div>
          )}

          {items.map((item) => (
            <div key={item.id} className="bg-green-200 rounded-xl p-4 flex flex-col gap-2">
              <p className="text-lg font-serif font-bold text-emerald-900">
                {item.product?.name || "Unknown Product"}
              </p>
              <p className="text-emerald-900 font-bold">
                ${getItemPrice(item).toFixed(2)} / unit
              </p>
              <p className="text-emerald-900 font-serif text-sm">Quantity: {item.quantity}</p>
              <p className="text-emerald-900 font-serif text-sm">
                Subtotal: <span className="font-bold">${(getItemPrice(item) * item.quantity).toFixed(2)}</span>
              </p>
            </div>
          ))}

          {items.length > 0 && (
            <>
              <div className="bg-green-200 rounded-xl p-4">
                <p className="text-emerald-900 font-serif text-sm">
                  Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
                </p>
                <p className="text-emerald-900 font-serif text-sm">
                  Pickup fee: <span className="font-bold">Free</span>
                </p>
                <p className="font-serif font-bold text-emerald-900 text-lg mt-2">
                  Total: ${subtotal.toFixed(2)}
                </p>
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

          {Object.entries(grouped).map(([vendorId, vendorItems]) => (
            <div key={vendorId} className="bg-green-200 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-lg font-serif font-bold text-emerald-900">Vendor</p>

              <div className="flex flex-wrap gap-2">
                {vendorItems.map((i) => (
                  <span key={i.id} className="bg-emerald-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {i.product?.name} ×{i.quantity}
                  </span>
                ))}
              </div>

              <p className="font-bold text-emerald-900 text-sm">Select a pickup window:</p>
              <div className="flex flex-wrap gap-2">
                {["Mon 8am–12pm", "Wed 2pm–6pm", "Sat 7am–11am"].map((w) => (
                  <button
                    key={w}
                    onClick={() => setPickupSelections((s) => ({ ...s, [vendorId]: w }))}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition
                      ${pickupSelections[vendorId] === w
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
            <button onClick={() => setStep(1)} className="bg-green-200 text-emerald-900 px-6 py-2 rounded-full font-bold hover:bg-green-300">
              ← Back
            </button>
            <button
              onClick={handleReserve}
              disabled={!canProceed}
              className={`px-8 py-2 rounded-full font-bold transition
                ${canProceed ? "bg-emerald-900 hover:bg-emerald-700 text-white" : "bg-green-200 text-emerald-400 cursor-not-allowed"}`}
            >
              {canProceed ? "Reserve Items →" : "Select all pickup windows first"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Confirm */}
      {step === 3 && (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <h1 className="text-2xl font-serif font-bold text-emerald-900">Review & Confirm</h1>

          {Object.entries(grouped).map(([vendorId, vendorItems]) => (
            <div key={vendorId} className="bg-green-200 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <p className="text-lg font-serif font-bold text-emerald-900">Vendor</p>
                <span className="bg-emerald-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                  🕐 {pickupSelections[vendorId]}
                </span>
              </div>
              {vendorItems.map((i) => (
                <div key={i.id} className="flex justify-between gap-3">
                  <div>
                    <p className="font-bold text-emerald-900 font-serif">{i.product?.name}</p>
                    <p className="text-emerald-900 font-serif text-sm">×{i.quantity} unit</p>
                  </div>
                  <p className="font-bold text-emerald-900">
                    ${(getItemPrice(i) * i.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ))}

          <div className="bg-green-200 rounded-xl p-4">
            <p className="text-emerald-900 font-serif text-sm">
              Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
            </p>
            <p className="text-emerald-900 font-serif text-sm">
              Pickup fee: <span className="font-bold">Free</span>
            </p>
            <p className="font-serif font-bold text-emerald-900 text-lg mt-2">
              Total: ${subtotal.toFixed(2)}
            </p>
          </div>

          <p className="text-emerald-900 font-serif text-sm">
            💡 Payment is collected at pickup. Your order will show as Pending until the vendor confirms.
          </p>

          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setStep(2)} className="bg-green-200 text-emerald-900 px-6 py-2 rounded-full font-bold hover:bg-green-300">
              ← Back
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="bg-emerald-900 hover:bg-emerald-700 text-white px-8 py-2 rounded-full font-bold"
            >
              {placing ? "Placing Order..." : "Place Order 🌿"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
