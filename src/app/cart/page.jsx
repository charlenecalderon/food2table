"use client";

import { useState } from "react";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        { id: 1, name : "Item One", price : 9.99, quantity : 1 },
        { id: 2, name : "Item Two", price : 14.99, quantity : 1 },
    ]);

    const handleAdd =  (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const handleMinus = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    const handleRemove  = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    return (
        <main>
            <h1>Your Cart</h1>

            <div>
                {cartItems.map((item) => (
                    <div key={item.id}>
                        <p>{item.name}</p>
                        <p>${item.price.toFixed(2)}</p>
                        <p>Quantity: {item.quantity}</p>
                        <button onClick={() => handleAdd(item.id)}>+</button>
                        <button onClick={() => handleMinus(item.id)}>-</button>
                        <button onClick={() => handleRemove(item.id)}>Remove</button>
                    </div>
                ))}
            </div>

            <div>
                <h2>
                    Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                </h2>
            </div>

        </main>
    );
}