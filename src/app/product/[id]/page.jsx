"use client";
import { useState, useEffect, use } from "react";
import NavBar from "../../../components/NavBar";

const API_URL = "https://food2table-production.up.railway.app";

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const [listing, setListing] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`${API_URL}/listings/${id}`);
        if (!response.ok) throw new Error("Listing not found");
        const data = await response.json();
        setListing(data.listing);

        // Try to fetch vendor profile
        try {
          const token = localStorage.getItem("token");
          if (true) {
            const vendorRes = await fetch(`${API_URL}/vendor/${data.listing.sellerId}`, {
            });
            if (vendorRes.ok) {
              const vendorData = await vendorRes.json();
              setVendor(vendorData);
            }
          }
        } catch (e) {
          // vendor info optional
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/orderItems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, quantity: qty }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Could not add to cart. Please try again.");
        return;
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert("Could not add to cart. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-emerald-50 min-h-screen">
        <NavBar />
        <div className="p-6 flex justify-center items-center">
          <p className="text-emerald-900">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="bg-emerald-50 min-h-screen">
        <NavBar />
        <div className="p-6 flex justify-center items-center">
          <p className="text-red-600">{error || "Listing not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 min-h-screen">
      <NavBar />
      <div className="p-6">

        {/* Listing Card */}
        <div className="bg-green-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 mb-6 max-w-4xl mx-auto">

          {/* Image */}
          {listing.imageUrl && (
            <img
              className="rounded-xl object-cover"
              style={{ width: "200px", height: "200px" }}
              src={listing.imageUrl}
              alt={listing.title}
            />
          )}

          <div className="flex flex-col gap-3 flex-1">
            <h1 className="text-2xl font-serif font-bold text-emerald-900">{listing.title}</h1>
            <p className="text-emerald-900 font-bold text-lg">${Number(listing.price).toFixed(2)}</p>
            <p className="text-emerald-900 font-serif text-sm">{listing.description || "No description available."}</p>

            {/* Availability */}
            <p className="text-emerald-900 text-sm font-semibold">
              {listing.isAvailable ? "✅ Available" : "❌ Sold Out"}
            </p>

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
                  {vendor?.name || "Vendor info coming soon"}
                </p>
                <p className="text-emerald-800 text-sm">
                  📍 {vendor?.location || "Location not available"}
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-emerald-900 font-bold text-sm mb-1">
                Pickup Instructions
              </p>
              <p className="text-gray-600 text-sm">
                {vendor?.pickupInstructions || "Pickup instructions coming soon."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
