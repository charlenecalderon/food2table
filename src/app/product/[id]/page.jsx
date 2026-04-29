"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const API_URL = "http://localhost:3001";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  // Fetch listing from backend
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);

        if (!res.ok) {
          setError("Listing not found.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setListing(data.listing);
      } catch (err) {
        setError("Could not load listing. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  // Add to cart
  const handleAddToCart = async () => {
    try {
      setAdding(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in to add items to your cart.");
        return;
      }

      const res = await fetch(`${API_URL}/orderItems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, quantity: qty }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert("Could not add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-emerald-50 min-h-screen p-6 flex items-center justify-center">
        <p className="text-emerald-900 font-serif text-lg">Loading listing...</p>
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
          <a href="/browse" className="text-emerald-600 font-bold text-sm hover:underline mt-2 inline-block">
            ← Back to Browse
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 min-h-screen p-6">

      {/* Product Card */}
      <div className="bg-green-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 mb-6 max-w-4xl mx-auto">

        {/* Info */}
        <div className="flex flex-col gap-3 flex-1">

          {/* Availability tag */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-white text-xs font-bold px-3 py-1 rounded-full ${listing.isAvailable ? "bg-emerald-900" : "bg-red-400"}`}>
              {listing.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          <h1 className="text-2xl font-serif font-bold text-emerald-900">{listing.title}</h1>
          <p className="text-emerald-900 font-bold text-xl">${listing.price?.toFixed(2)}</p>
          <p className="text-emerald-900 font-serif text-sm">{listing.description}</p>

          {/* Quantity + Add to Cart */}
          {listing.isAvailable && (
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="bg-emerald-900 hover:bg-emerald-700 text-white px-4 py-1 rounded-full font-bold"
              >-</button>
              <span className="font-bold text-emerald-900 px-2">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="bg-emerald-900 hover:bg-emerald-700 text-white px-4 py-1 rounded-full font-bold"
              >+</button>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="bg-emerald-900 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-bold text-sm disabled:opacity-50"
              >
                {added ? "✓ Added!" : adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Info Card */}
      <div className="bg-green-200 rounded-xl p-6 max-w-4xl mx-auto">
        <h2 className="text-lg font-serif font-bold text-emerald-900 mb-4">Vendor Info</h2>
        <p className="text-emerald-900 font-serif text-sm">
          Vendor ID: <span className="font-bold">{listing.sellerId}</span>
        </p>
        <p className="text-emerald-900 font-serif text-sm mt-2">
          💡 More vendor details coming soon once the Vendor Info API is ready.
        </p>
      </div>

      {/* Back link */}
      <div className="max-w-4xl mx-auto mt-4">
        <a href="/browse" className="text-emerald-900 font-bold hover:underline text-sm">
          ← Back to Browse
        </a>
      </div>

    </div>
  );
}
