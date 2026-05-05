"use client";

import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import useRequireAuth from "../../lib/useRequireAuth";
import Link from "next/link";

export default function CartPage() {
  useRequireAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function fetchCart() {
      try {
        const res = await fetch("https://food2table-production.up.railway.app/carts/current", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          const mapped = data.currentCart.items.map((item) => ({
            id: item.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          }));
          setCartItems(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  const handleAdd = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://food2table-production.up.railway.app/orderItems/${id}/increase`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setCartItems(cartItems.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        ));
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleMinus = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://food2table-production.up.railway.app/orderItems/${id}/decrease`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setCartItems(cartItems.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
        ));
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemove = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://food2table-production.up.railway.app/orderItems/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setCartItems(cartItems.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-emerald-50 min-h-screen">
      <NavBar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-serif font-bold text-emerald-900 mb-6">Your Cart</h1>

        {loading && <p className="text-emerald-900 font-serif">Loading your cart...</p>}

        {!loading && cartItems.length === 0 && (
          <div className="bg-green-200 rounded-xl p-6 text-center">
            <p className="text-emerald-900 font-serif mb-4">Your cart is empty.</p>
            <Link href="/browse" className="bg-emerald-900 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-bold inline-block">
              Browse Products
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-green-200 rounded-xl p-4 flex flex-col gap-2">
              <p className="text-lg font-serif font-bold text-emerald-900">{item.name}</p>
              <p className="text-emerald-900 font-bold">${item.price.toFixed(2)} / unit</p>
              <p className="text-emerald-900 font-serif text-sm">Quantity: {item.quantity}</p>
              <p className="text-emerald-900 font-serif text-sm">
                Subtotal: <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </p>
              <div className="flex gap-2 mt-1">
                <button onClick={() => handleAdd(item.id)} className="bg-emerald-900 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-700">+</button>
                <button onClick={() => handleMinus(item.id)} className="bg-emerald-900 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-700">−</button>
                <button onClick={() => handleRemove(item.id)} className="bg-red-400 text-white px-4 py-1 rounded-full font-bold hover:bg-red-500">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <>
            <div className="mt-4 bg-green-200 rounded-xl p-4">
              <p className="text-emerald-900 font-serif text-sm">Pickup fee: <span className="font-bold">Free</span></p>
              <p className="font-serif font-bold text-emerald-900 text-lg mt-1">Total: ${total.toFixed(2)}</p>
            </div>
            <div className="mt-4">
              <Link href="/checkout">
                <button className="bg-emerald-900 hover:bg-emerald-700 text-white px-8 py-2 rounded-full font-bold">
                  Proceed to Checkout →
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
