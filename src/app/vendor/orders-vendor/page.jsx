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
        <main className="p-6">
            <h1 className="text-3x1 font-serif font-bold text-emerald-900 mb-6">Vendor Orders</h1>
            
            <div className="flex flex-col gap-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                        <h2 className="text-xl font-serif font-bold text-emerald-900">Order #{order.id}</h2>
                        <p className="text-gray-600">Customer: {order.customerName}</p>
                        <p className="text-gray-600">Email: {order.customerEmail}</p>
                        <p className="text-gray-600">Date: {order.date}</p>
                        <p className="text-gray-600">Status: <span className="text-emerald-600 font-bold">{order.status}</span></p>


                    <button
                        onClick={() => handleMarkStarted(order.id)}
                        disabled={order.status === "started"}
                        className={`w-40 py-2 rounded-full font-bold text-white transition-all
                            ${order.status === "started"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-emerald-500 hover:bg-emerald-600"}`}
                    >
                        
                        {order.status === "started" ? "Started" : "Mark Started"}
                    </button>

                        <div className="mt-2">
                            <h3 className="text-lg font-serif font-bold text-emerald-800 mb-2">Reserved Items:</h3>
                            
                            {order.items.map((item) => (
                                <div key={item.id} className="bg-emerald-50 rounded-lg p-3 mb-2">
                                    <p className="font-bold text-emerald-900">{item.name}</p>
                                    <p className="text-emerald-600">${item.price.toFixed(2)}</p>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                            ))}
                    </div>

                </div>
                ))}
            </div>
            
        </main>
    );
}