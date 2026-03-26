"use client";

import { useState } from "react";

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = {
    id: 1,
    name: "Organic Strawberries",
    price: 6.99,
    category: "Fruit",
    dietaryTags: ["Organic", "Non-GMO"],
    available: 12,
    description:
      "Fresh organic strawberries picked locally. Sweet, juicy, and perfect for snacks, smoothies, or desserts.",
    image:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80",
    vendor: {
      name: "Local Farm",
      location: "San Bernardino, CA",
      pickupInstructions: "Please check in with the vendor stand when you arrive.",
      pickupWindows: [
        "Monday, 10:00 AM - 12:00 PM",
        "Wednesday, 2:00 PM - 5:00 PM",
        "Saturday, 9:00 AM - 1:00 PM",
      ],
    },
  };

  const increaseQuantity = () => {
    if (quantity < product.available) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-6">
        Product Detail
      </h1>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-emerald-900">
                {product.name}
              </h2>
              <p className="text-emerald-600 font-bold text-lg mt-1">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-sm font-semibold">
                {product.category}
              </span>
              {product.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-700">
              Available:{" "}
              <span className="text-emerald-700 font-bold">
                {product.available}
              </span>
            </p>

            <p className="text-gray-700">{product.description}</p>

            <div>
              <p className="text-lg font-serif font-bold text-emerald-900 mb-2">
                Quantity
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseQuantity}
                  className="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-600"
                >
                  -
                </button>
                <span className="text-lg font-semibold text-emerald-900 px-3">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-600"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={handleAddToCart}
                className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold hover:bg-emerald-600"
              >
                {added ? "Added!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-serif font-bold text-emerald-900 mb-3">
          Vendor Information
        </h2>
        <p className="text-gray-700 mb-2">
          Vendor Name:{" "}
          <span className="text-emerald-700 font-bold">{product.vendor.name}</span>
        </p>
        <p className="text-gray-700 mb-2">
          Location:{" "}
          <span className="text-emerald-700">{product.vendor.location}</span>
        </p>
        <p className="text-gray-700 mb-3">
          Pickup Instructions: {product.vendor.pickupInstructions}
        </p>

        <h3 className="text-lg font-serif font-bold text-emerald-900 mb-2">
          Pickup Windows
        </h3>
        <ul className="list-disc pl-6 text-gray-700">
          {product.vendor.pickupWindows.map((window) => (
            <li key={window}>{window}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}