"use client";
import { useState } from "react";

// Placeholder product data (will connect to backend later)
const product = {
  id: 1,
  name: "Heirloom Tomatoes",
  price: 3.50,
  vendor: "Sunrise Valley Farm",
  vendorLocation: "Riverside, CA",
  vendorPickupInstructions: "Text us when you arrive — use the side gate on Oak St.",
  vendorPickupWindows: ["Mon 8am–12pm", "Wed 2pm–6pm", "Sat 7am–11am"],
  category: "Vegetables",
  dietaryTags: ["Organic", "Non-GMO"],
  quantityAvailable: 18,
  desc: "Sun-ripened heirloom tomatoes grown without pesticides on our family farm in Riverside County. Perfect for salads, sauces, or fresh slicing.",
  img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
};

export default function ProductDetailPage() {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="p-6">

      {/* Product Card */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 mb-6">

        {/* Image */}
        <img
          className="rounded-xl object-cover"
          style={{ width: "200px", height: "200px" }}
          src={product.img}
          alt={product.name}
        />

        {/* Info */}
        <div className="flex flex-col gap-3 flex-1">

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.category}
            </span>
            {product.dietaryTags.map((tag) => (
              <span key={tag} className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-serif font-bold text-emerald-900">{product.name}</h1>
          <p className="text-emerald-600 font-bold text-xl">${product.price.toFixed(2)} / lb</p>
          <p className="text-gray-600">{product.desc}</p>

          {/* Availability */}
          <p className="text-gray-600">
            {product.quantityAvailable > 0
              ? `✅ ${product.quantityAvailable} lbs available`
              : "❌ Sold Out"}
          </p>

          {/* Quantity + Add to Cart */}
          {product.quantityAvailable > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-600"
              >-</button>
              <span className="font-bold text-emerald-900">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.quantityAvailable, q + 1))}
                className="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-600"
              >+</button>
              <button
                onClick={handleAddToCart}
                className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold hover:bg-emerald-600"
              >
                {added ? "✓ Added!" : "Add to Cart"}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Vendor Info Card */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-serif font-bold text-emerald-900 mb-4">Vendor Info</h2>

        <p className="text-lg font-serif font-bold text-emerald-900">{product.vendor}</p>
        <p className="text-gray-600 mb-4">📍 {product.vendorLocation}</p>

        {/* Pickup Instructions */}
        <div className="bg-emerald-50 rounded-xl p-4 mb-4">
          <p className="font-bold text-emerald-900 mb-1">Pickup Instructions</p>
          <p className="text-gray-600">{product.vendorPickupInstructions}</p>
        </div>

        {/* Pickup Windows */}
        <p className="font-bold text-emerald-900 mb-2">Available Pickup Windows</p>
        <div className="flex flex-wrap gap-2">
          {product.vendorPickupWindows.map((window) => (
            <span
              key={window}
              className="bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full"
            >
              🕐 {window}
            </span>
          ))}
        </div>
      </div>

    </main>
  );
}
