"use client";

import { useEffect, useState } from "react";

export default function ProductDetailPage({ params }) {
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://127.0.0.1:3000/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load product.");
          return;
        }

        setProduct(data.product);
      } catch (err) {
        setError("Could not connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="p-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6 text-center text-emerald-900 font-semibold">
          Loading product...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6 text-center text-red-600 font-semibold">
          {error}
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="p-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6 text-center text-red-600 font-semibold">
          Product not found.
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4 mb-4">
        <img
          className="rounded-xl object-cover shrink-0"
          style={{ width: "150px", height: "150px" }}
          src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80"
          alt={product.name}
        />

        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Product
            </span>
          </div>

          <h1 className="text-2xl font-serif font-bold text-emerald-900">
            {product.name}
          </h1>

          <p className="text-emerald-600 font-bold text-lg">
            ${Number(product.price).toFixed(2)}
          </p>

          <p className="text-gray-600 text-sm">
            {product.description || "No description available."}
          </p>

          <p className="text-emerald-800 text-sm font-semibold">
            Seller ID: {product.sellerId}
          </p>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <div className="flex items-center bg-white rounded-full overflow-hidden border border-emerald-300">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-emerald-900 font-bold hover:bg-emerald-100"
              >
                −
              </button>
              <span className="px-3 font-bold text-emerald-900 text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-1 text-emerald-900 font-bold hover:bg-emerald-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2 rounded-full text-sm"
            >
              {added ? "✓ Added!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-serif font-bold text-emerald-900 mb-3">
          Vendor Info
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 rounded-full w-12 h-12 flex items-center justify-center text-xl">
              🌻
            </div>
            <div>
              <p className="text-emerald-900 font-bold font-serif text-base">
                Vendor info coming soon
              </p>
              <p className="text-emerald-800 text-sm">
                Seller ID: {product.sellerId}
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3">
            <p className="text-emerald-900 font-bold text-sm mb-1">
              Pickup Instructions
            </p>
            <p className="text-gray-600 text-sm">
              Vendor profile endpoint is still in progress, so this section is using placeholder text for now.
            </p>
          </div>

          <div>
            <p className="text-emerald-900 font-bold text-sm mb-2">
              Available Pickup Windows
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-full">
                Pickup info coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}