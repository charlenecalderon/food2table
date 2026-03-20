"use client"; 
import { useState } from "react"; // Imports useState to manage the order data

export default function OrdersPage() {

    // Orders state to hold the orders list that customers place
    // Orders given id, customerName, customerEmail, date, status, and reserved items 
    // All current data is for testing
    const [orders, setOrders] = useState([
        {
            id: 1,
            customerName: "Im Tired",
            customerEmail: "ImTired@gmail.com",
            date: "03-19-2026",
            status: "Pending",
            items: [
                { id: 1, name: "Item One", price: 1.99, quantity: 9 },
                { id: 2, name: " Item Two", price: 0.99, quantity: 8 },
            ],
        },
        {
           id: 2,
            customerName: "Need Sleep",
            customerEmail: "NeedSleep@gmail.com",
            date: "03-19-2026",
            status: "Pending",
            items: [
                { id: 3, name: "Item One", price: 2.99, quantity: 7 },
            ],
        }
    ]);

    // The function to mark an order as started and change status (Pending/Started)
    const handleMarkStarted = (id) => {
        setOrders (orders.map(order =>
            order.id === id ? { ...order, status: "Started" } : order
        ));
    };

    return (
        <main>
            <h1>Vendor Orders</h1>

            {/* Loop to go through the orders and render the order card*/}
            <div>
                {orders.map((order)=> (
                    <div key={order.id}> {/* The key to help track an order*/}
                        
                        {/* All customer's order information */}
                        <h2>Order #{order.id}</h2>
                        <p>Customer: {order.customerName}</p>
                        <p>Email: {order.customerEmail}</p>
                        <p>Date: {order.date}</p>
                        <p>Status: {order.status}</p>

                        {/* This button marks orders as Started and then cannot be changed */}
                        <button
                          onClick={() => handleMarkStarted(order.id)}
                          disabled={order.status === "Started"}
                          >
                            {order.status ==="Started?" ? "Started" : "Mark Started"}
                            </button>  

                        {/* Items in the order that are reserved */}
                        <div>
                            <h3>Reserved Items:</h3>

                            {/* Loop to go through each item within an order and show order information */}
                            {order.items.map((item) => (
                                <div key={item.id}>
                                    <p>{item.name}</p>
                                    <p>${item.price.toFixed(2)}</p> {/* "toFixed(2) used to keep price at two decimal places only */}
                                    <p>Quantity: {item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    
                    </div>
                ))}
            </div>
        </main>
    );
}