"use client";
import { useState } from "react";

// Placeholder product data (will connect to backend later)
const product = {
  id: 1,
  name: "Heirloom Tomatoes",
  price: "$3.50 / lb",
  vendor: "Sunrise Valley Farm",
  vendorLocation: "Riverside, CA",
  vendorPickupInstructions: "Text us when you arrive — use the side gate on Oak St.",
  vendorPickupWindows: ["Mon 8am–12pm", "Wed 2pm–6pm", "Sat 7am–11am"],
  category: "Vegetables",
  dietaryTags: ["Organic", "Non-GMO"],
  quantityAvailable: 18,
  desc: "Sun-ripened heirloom tomatoes grown without pesticides on our family farm in Riverside County. Perfect for salads, sauces, or fresh slicing. Rich, complex flavour you won't find at the grocery store.",
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
    <div className="bg-emerald-50 min-h-screen w-screen">

      {/* Header - matches Kimmy's style */}
      <div className="w-screen h-60 object-fill">
        <img
          className="w-screen h-60 object-cover"
          src="https://thumbs.dreamstime.com/b/day-life-pixelated-farm-dive-vibrant-world-charming-pixel-art-where-characters-tend-to-their-crops-332448133.jpg"
          alt="banner"
        />
      </div>

      {/* Navbar - matches Kimmy's style */}
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

      {/* Nav buttons */}
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

      {/* Product Detail Content */}
      <div className="p-6 max-w-4xl mx-auto">

        {/* Product Card */}
        <div className="bg-green-200 rounded-xl p-6 flex flex-col md:flex-row gap-6">

          {/* Image */}
          <img
            className="rounded-xl h-64 w-full md:w-72 object-cover"
            src={product.img}
            alt={product.name}
          />

          {/* Info */}
          <div className="flex flex-col gap-3 flex-1">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-emerald-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.dietaryTags.map((tag) => (
                <span key={tag} className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-emerald-900 font-bold font-serif text-3xl">{product.name}</h1>
            <p className="text-emerald-900 font-bold text-xl">{product.price}</p>
            <p className="text-emerald-900 font-serif text-sm">{product.desc}</p>

            {/* Availability */}
            <p className="text-emerald-800 text-sm font-semibold">
              {product.quantityAvailable > 0
                ? `✅ ${product.quantityAvailable} lbs available`
                : "❌ Sold Out"}
            </p>

            {/* Quantity + Add to Cart */}
            {product.quantityAvailable > 0 && (
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center bg-white rounded-full overflow-hidden border border-emerald-300">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 text-emerald-900 font-bold hover:bg-emerald-100"
                  >−</button>
                  <span className="px-4 font-bold text-emerald-900">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.quantityAvailable, q + 1))}
                    className="px-4 py-2 text-emerald-900 font-bold hover:bg-emerald-100"
                  >+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-emerald-900 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-full"
                >
                  {added ? "✓ Added!" : "Add to Cart"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Vendor Info Card */}
        <div className="bg-green-200 rounded-xl p-6 mt-6">
          <h2 className="text-emerald-900 font-bold font-serif text-2xl mb-4">Vendor Info</h2>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-800 rounded-full w-14 h-14 flex items-center justify-center text-2xl">
                🌻
              </div>
              <div>
                <p className="text-emerald-900 font-bold font-serif text-lg">{product.vendor}</p>
                <p className="text-emerald-800 text-sm">📍 {product.vendorLocation}</p>
              </div>
            </div>

            {/* Pickup Instructions */}
            <div className="bg-emerald-100 rounded-xl p-4 mt-2">
              <p className="text-emerald-900 font-bold text-sm mb-1">Pickup Instructions</p>
              <p className="text-emerald-800 text-sm font-serif">{product.vendorPickupInstructions}</p>
            </div>

            {/* Pickup Windows */}
            <div>
              <p className="text-emerald-900 font-bold text-sm mb-2">Available Pickup Windows</p>
              <div className="flex flex-wrap gap-2">
                {product.vendorPickupWindows.map((window) => (
                  <span
                    key={window}
                    className="bg-emerald-900 text-white text-sm font-bold px-4 py-2 rounded-full"
                  >
                    🕐 {window}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
