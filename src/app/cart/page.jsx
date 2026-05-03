"use client"; // Allows rendering for interactivity and useState from user-side

import { useState, useEffect } from "react"; // Imports useState to manage the user's cart data
import NavBar from "../../components/NavBar";
import useRequireAuth from "../../lib/useRequireAuth";
import Link from 'next/link';

export default function CartPage() {
  useRequireAuth();

    // Cart items state holds the list of items in the cart, each has an id/name/price/quantity
    const [cartItems, setCartItems] = useState([]);

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
            }
        }

        fetchCart();
    }, []);

    // Function to increase item quantity by 1
    const handleAdd = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`https://food2table-production.up.railway.app/orderItems/${id}/increase`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`,
                },
            });
            if (res.ok){
                setCartItems(cartItems.map((i) =>
                    i.id === id ? { ...i, quantity: i.quantity + 1 } : i
                ));
            }
        } catch (err) {
            console.error("Failed to update quantity:", err);
        }
    };

    // Function to decrease item quantity by 1, minimum quantity of 1
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
                    i.id === id ? { ...i, quantity: i.quantity - 1 } : i
                ));
            }
        } catch (err) {
            console.error("Failed to update quantity:", err);
        }
    };

    // Function to remove an item from the user's cart
    const handleRemove  = async (id) => {
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

    // Function to reserve items in user's cart
    const handleReserve = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("https://food2table-production.up.railway.app/carts/reserve", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                alert("Items reserved successfully!");
            } else {
                alert("Failed to reserve items.");
            }
        } catch (err) {
            console.error("Failed to reserve cart:", err);
        }
    };

    return (
        
        <main className="p-6">
            <NavBar/>
            <h1 className="text-3x1 font-serif font-bold text-emerald-900 mb-6">Your Cart</h1>

            <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-x1 shadow p-4 flex flex-col gap-2">
                        
                        <p className="text-lg font-serif font-bold text-emerald-900">{item.name}</p>
                        <p className="text-emerald-600 font-bold">${item.price.toFixed(2)}</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>

                        <div className="flex gap-2">
                            <button
                            onClick={() => handleAdd(item.id)}
                            className="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-600"
                            >+</button>
                            <button
                            onClick={() => handleMinus(item.id)}
                            className="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-600"
                            >-</button>
                            <button
                            onClick={() => handleRemove(item.id)}
                            className="bg-red-400 text-white px-4 py-1 rounded-full font-bold hover:bg-red-500"
                            >Remove</button>
                        </div>

                    </div>
                ))}
            </div>

            <div className="mt-6 bg-white rounded-x1 shadow p-4">
                <h2 className="text-x1 font-serif font-bold text-emerald-900">
                    Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                </h2>
            </div>

            {/* Aprajtita's addition of reserve and checkout button */}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={handleReserve}
                    className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold hover:bg-emerald-600"
                >
                    Reserve Items
                </button>

                {/* Aprajita's addition of checkout button link to checkout page */}
                <Link href="/checkout">
                    <button className="bg-emerald-900 text-white px-8 py-2 rounded-full font-bold hover:bg-emerald-700">
                        Checkout 
                    </button>
                </Link>
            </div>
        </main>
    );
}
