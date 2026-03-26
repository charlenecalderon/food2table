"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [placedOrder, setPlacedOrder] = useState(false);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Organic Strawberries",
      price: 6.99,
      quantity: 1,
      vendor: "Local Farm",
      pickupLocation: "San Bernardino Market",
      pickupInstructions: "Pick up at the fruit stand near the front entrance.",
      pickupOptions: [
        "Monday, 10:00 AM - 12:00 PM",
        "Wednesday, 2:00 PM - 5:00 PM",
      ],
      selectedPickup: "",
    },
    {
      id: 2,
      name: "Fresh Bread",
      price: 4.5,
      quantity: 2,
      vendor: "Bread Corner",
      pickupLocation: "Downtown Pickup Booth",
      pickupInstructions: "Show your order confirmation at the bakery table.",
      pickupOptions: [
        "Tuesday, 9:00 AM - 11:00 AM",
        "Friday, 1:00 PM - 4:00 PM",
      ],
      selectedPickup: "",
    },
  ]);

  const handleAdd = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleMinus = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handlePickupChange = (id, value) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, selectedPickup: value } : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const allPickupsSelected = cartItems.every((item) => item.selectedPickup);

  const handlePlaceOrder = () => {
    setPlacedOrder(true);
  };

  if (placedOrder) {
    return (
      <main className="p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-700">
            Your order has been placed and your pickup times have been confirmed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-6">
        Checkout
      </h1>

      <div className="mb-6">
        <p className="text-lg font-semibold text-emerald-900">
          Step {step} of 3
        </p>
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-serif font-bold text-emerald-900 mb-4">
            Review Your Cart
          </h2>

          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow p-4">
                <p className="text-lg font-serif font-bold text-emerald-900">
                  {item.name}
                </p>
                <p className="text-emerald-600 font-bold">
                  ${item.price.toFixed(2)}
                </p>
                <p className="text-gray-600 mb-3">Quantity: {item.quantity}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAdd(item.id)}
                    className="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleMinus(item.id)}
                    className="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-600"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="bg-red-400 text-white px-4 py-1 rounded-full font-bold hover:bg-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white rounded-xl shadow p-4">
            <h3 className="text-xl font-serif font-bold text-emerald-900">
              Subtotal: ${subtotal.toFixed(2)}
            </h3>
          </div>

          <button
            onClick={() => setStep(2)}
            className="mt-4 bg-emerald-500 text-white px-8 py-2 rounded-full font-bold hover:bg-emerald-600"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-serif font-bold text-emerald-900 mb-4">
            Select Pickup Times
          </h2>

          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow p-4">
                <p className="text-lg font-serif font-bold text-emerald-900 mb-2">
                  {item.name}
                </p>
                <p className="text-gray-700">
                  Vendor: <span className="text-emerald-700">{item.vendor}</span>
                </p>
                <p className="text-gray-700">
                  Pickup Location: {item.pickupLocation}
                </p>
                <p className="text-gray-700 mb-3">
                  Instructions: {item.pickupInstructions}
                </p>

                <select
                  value={item.selectedPickup}
                  onChange={(e) => handlePickupChange(item.id, e.target.value)}
                  className="w-full border border-emerald-200 rounded-lg p-2"
                >
                  <option value="">Select a pickup window</option>
                  {item.pickupOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-bold hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!allPickupsSelected}
              className={`px-6 py-2 rounded-full font-bold text-white ${
                allPickupsSelected
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-serif font-bold text-emerald-900 mb-4">
            Confirm & Place Order
          </h2>

          <div className="bg-white rounded-xl shadow p-4">
            {cartItems.map((item) => (
              <div key={item.id} className="mb-4 border-b border-emerald-100 pb-4">
                <p className="text-lg font-serif font-bold text-emerald-900">
                  {item.name}
                </p>
                <p className="text-gray-700">Quantity: {item.quantity}</p>
                <p className="text-gray-700">
                  Pickup Time:{" "}
                  <span className="text-emerald-700 font-semibold">
                    {item.selectedPickup}
                  </span>
                </p>
                <p className="text-emerald-600 font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <h3 className="text-xl font-serif font-bold text-emerald-900">
              Total: ${subtotal.toFixed(2)}
            </h3>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-bold hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={handlePlaceOrder}
              className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold hover:bg-emerald-600"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </main>
  );
}