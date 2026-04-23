
'use client';

import NavBar from "../../components/NavBar";
import Link from "next/link";
import { useState, useEffect } from "react";

{/*layout for the data to be shown as a card*/}
function ProductCard({ product }) {
  return (
    <div className="bg-green-200 text-white rounded-xl w-72 p-4">
      <img
        className="rounded-xl h-40 w-full object-cover"
        src={product.img || "/placeholder.jpg"}
        alt={product.name}
      />
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-emerald-900 font-bold font-serif">{product.name}</h2>
        <span className="text-emerald-900 font-bold">${product.price}</span>
      </div>
      <div className="flex justify-between mt-2">
        <Link href={`/product/${product.id}`}>
          <button className="bg-emerald-900 hover:bg-emerald-700 rounded-full px-3 py-1 text-sm text-white">
            View Product
          </button>
        </Link>
      </div>
      <p className="text-emerald-900 font-serif text-sm mt-2 line-clamp-4">{product.description}</p>
    </div>
  )
}

{/*fetch products from backend */}
function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-5">
        <div className="flex justify-center items-center">
          <p className="text-emerald-900">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <div className="flex justify-center items-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex flex-wrap gap-6 justify-start">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function Browse() {
  return (
    <>
    <NavBar/>
      {/* products section */}
      <ProductsList />
</>
   
  );
}