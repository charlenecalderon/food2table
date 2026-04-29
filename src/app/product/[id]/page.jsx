"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ProductPage() {
  const params = useParams();
  const id = useMemo(() => {
    if (!params?.id) return "";
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params]);

  const [product, setProduct] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setVendor(null);

        const res = await fetch(`${API_BASE}/products/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch product.");
        }

        const fetchedProduct = data.product;
        setProduct(fetchedProduct);

        if (fetchedProduct?.sellerId) {
          try {
            setVendorLoading(true);

            const vendorRes = await fetch(
              `${API_BASE}/profiles/${fetchedProduct.sellerId}`,
              {
                method: "GET",
                cache: "no-store",
              }
            );

            if (vendorRes.ok) {
              const vendorData = await vendorRes.json();
              setVendor(vendorData.profile || vendorData.vendor || vendorData);
            }
          } catch {
            // leave vendor as null if endpoint does not exist yet
          } finally {
            setVendorLoading(false);
          }
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8faf7] px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-lg font-medium text-gray-700">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f8faf7] px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-red-600">
            Could not load product
          </h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f8faf7] px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Product not found
          </h1>
          <p className="text-gray-600">
            We could not find a product for this page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf7] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2">
          <section className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-72 items-center justify-center rounded-2xl bg-[#e8f3e6] text-center text-gray-500">
              Product image coming soon
            </div>

            <div className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              {product.isAvailable ? "Available" : "Out of stock"}
            </div>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-700">
              {product.description || "No description available."}
            </p>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Product details
              </h2>

              <div className="space-y-3 text-gray-700">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="font-medium">Stock</span>
                  <span>{product.stock ?? "N/A"}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <span className="font-medium">Status</span>
                  <span>{product.isAvailable ? "In stock" : "Unavailable"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Seller ID</span>
                  <span className="break-all text-right text-sm">
                    {product.sellerId}
                  </span>
                </div>
              </div>

              <button
                className="mt-6 w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
                disabled={!product.isAvailable}
              >
                {product.isAvailable ? "Add to Cart" : "Unavailable"}
              </button>
            </section>

            <section className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Vendor information
              </h2>

              {vendorLoading ? (
                <p className="text-gray-600">Loading vendor info...</p>
              ) : vendor ? (
                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {vendor.businessName || vendor.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Bio:</span>{" "}
                    {vendor.bio || "No vendor bio available."}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {vendor.location || vendor.address || "N/A"}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">
                  Vendor details are not available yet.
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}