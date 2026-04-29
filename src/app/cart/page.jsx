"use client"; // Allows rendering for interactivity and useState from user-side

import { useState } from "react"; // Imports useState to manage the user's cart data
import NavBar from "../../components/NavBar";
import useRequireAuth from "../../lib/useRequireAuth";
import Link from 'next/link';
export default function CartPage() {
  useRequireAuth();

    // Cart items state holds the list of items in the cart, each has an id/name/price/quantity
    const [cartItems, setCartItems] = useState([
        // Pre-given name/price/quantity for testing
        { id: 1, name : "Item One", price : 9.99, quantity : 1 },
        { id: 2, name : "Item Two", price : 14.99, quantity : 1 },
    ]);

    // Function to increase item quantity by 1
    const handleAdd =  (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    // Function to decrease item quantity by 1, minimum quantity of 1
    const handleMinus = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    // Function to remove an item from the user's cart
    const handleRemove  = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // Function to reserve items in user's cart
    const handleReserve = () => {
        alert("Items reserved!"); // IMPORTANT NOTE TO SELF: IMPLEMENT BACKEND CONNECTION 
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

            <Link href="/checkout">
            <button
            onClick={handleReserve}
            className="mt-4 bg-emerald-500 text-white px-8 py-2 rounded-full font-bold hover:bg-emerald-600"
            >
                Reserve Items
            </button>
            </Link>
        </main>
    );
}
