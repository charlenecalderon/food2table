'use client';

import NavBar from "../../components/NavBar";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ListingCard({ listing }) {
  return (
    <div className="bg-green-200 text-white rounded-xl w-72 p-4">
      <img
        className="rounded-xl h-40 w-full object-cover"
        src={listing.imageUrl || "/placeholder.jpg"}
        alt={listing.title}
      />
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-emerald-900 font-bold font-serif">{listing.title}</h2>
        <span className="text-emerald-900 font-bold">${Number(listing.price).toFixed(2)}</span>
      </div>
      <p className="text-emerald-900 font-serif text-sm mt-2 line-clamp-4">{listing.description}</p>
    </div>
  );
}

function ListingsList() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // fetch all available listings to display on the browse page
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('https://food2table-production.up.railway.app/listings');
        if (!response.ok) throw new Error('Failed to fetch listings');
        const data = await response.json();
        setListings(data.listings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="p-5 flex justify-center">
        <p className="text-emerald-900">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 flex justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  // filter listings by search query if one exists
  const filtered = query
    ? listings.filter((l) =>
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.description.toLowerCase().includes(query.toLowerCase())
      )
    : listings;

  return (
    <div className="p-5">
      {query && (
        <p className="text-emerald-900 font-semibold mb-4">
          {filtered.length > 0
            ? `Showing results for "${query}"`
            : `No products found for "${query}"`}
        </p>
      )}
      <div className="flex flex-wrap gap-6 justify-start">
        {filtered.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

export default function Browse() {
  return (
    <>
      <NavBar />
      <Suspense fallback={<div className="p-5 text-emerald-900">Loading products...</div>}>
        <ListingsList />
      </Suspense>
    </>
  );
}
