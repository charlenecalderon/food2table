"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:3001/products/${id}`, {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch product");
        }

        setProduct(data.product);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading product...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!product) {
    return <div className="p-6">Product not found.</div>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <div className="space-y-3">
        <p>
          <span className="font-semibold">Description:</span>{" "}
          {product.description}
        </p>

        <p>
          <span className="font-semibold">Stock:</span> {product.stock}
        </p>

        <p>
          <span className="font-semibold">Available:</span>{" "}
          {product.isAvailable ? "Yes" : "No"}
        </p>

        <p>
          <span className="font-semibold">Seller ID:</span> {product.sellerId}
        </p>
      </div>
    </main>
  );
}