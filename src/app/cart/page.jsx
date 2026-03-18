"use client"; // Allows rendering for interactivity and useState from user-side

import { useState } from "react"; // Imports useState to manage the user's cart data

export default function CartPage() {

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

    return (
        <main>
            <h1>Your Cart</h1>

            {/* Loop to go through each item in user's cart and then render a card */}
            <div>
                {cartItems.map((item) => (
                    <div key={item.id}> {/* Key used to help with tracking each item */}
                        <p>{item.name}</p>
                        <p>${item.price.toFixed(2)}</p> {/* "toFixed(2)" used to show 2 decimal places for pricing */}
                        <p>Quantity: {item.quantity}</p>

                        {/* Quantity control functionality for users and the "Remove" button */}
                        <button onClick={() => handleAdd(item.id)}>+</button>
                        <button onClick={() => handleMinus(item.id)}>-</button>
                        <button onClick={() => handleRemove(item.id)}>Remove</button>
                    </div>
                ))}
            </div>
            {/* Calculates to show the total price of items in user's cart */}
            {/* Uses reduce() to loop through each item and add the prices times the quantity */}
            <div>
                <h2>
                    Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                </h2>
            </div>

        </main>
    );
}