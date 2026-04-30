"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NavBar from "../../../components/NavBar";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://food2table-production.up.railway.app/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-emerald-50 min-h-screen p-6 flex justify-center items-center">
        <p className="text-emerald-900">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-emerald-50 min-h-screen p-6 flex justify-center items-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-emerald-50 min-h-screen p-6 flex justify-center items-center">
        <p className="text-red-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 min-h-screen">
      <NavBar />
      <div className="p-6">

        {/* Product Card */}
        <div className="bg-green-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 mb-6 max-w-4xl mx-auto">

          {/* Image */}
          <img
            className="rounded-xl object-cover"
            style={{ width: "200px", height: "200px" }}
            src={product.img || "/placeholder.jpg"}
            alt={product.name}
          />

          <div className="flex flex-col gap-3 flex-1">
            <h1 className="text-2xl font-serif font-bold text-emerald-900">{product.name}</h1>
            <p className="text-emerald-900 font-bold text-lg">${Number(product.price).toFixed(2)} / lb</p>
            <p className="text-emerald-900 font-serif text-sm">{product.description || "No description available."}</p>

            {/* Availability */}
            <p className="text-emerald-900 text-sm font-semibold">
              {product.stock > 0
                ? `✅ ${product.stock} available`
                : "❌ Sold Out"}
            </p>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="bg-emerald-900 hover:bg-emerald-700 text-white px-4 py-1 rounded-full font-bold"
                >-</button>
                <span className="font-bold text-emerald-900 px-2">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="bg-emerald-900 hover:bg-emerald-700 text-white px-4 py-1 rounded-full font-bold"
                >+</button>
                <button
                  onClick={handleAddToCart}
                  className="bg-emerald-900 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-bold text-sm"
                >
                  {added ? "✓ Added!" : "Add to Cart"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Vendor Info Section */}
        <div className="bg-white rounded-xl shadow p-4 max-w-4xl mx-auto">
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

      </div>
    </div>
  );
}
