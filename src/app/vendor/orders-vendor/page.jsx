"use client";
import { useState, useEffect } from "react";

const API_BASE = "https://food2table-production.up.railway.app";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchVendorOrders() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE}/orders/vendor`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setOrders(data.orders ?? []);
                } else {
                    setError("Could not load orders.");
                }
            } catch (err) {
                console.error("Failed to fetch vendor orders:", err);
                setError("Could not load vendor orders.");
            } finally {
                setLoading(false);
            }
        }
        fetchVendorOrders();
    }, []);

    const handleMarkStarted = (id) => {
        setOrders(orders.map(order =>
            order.id === id ? { ...order, status: "Started" } : order
        ));
    };

    if (loading) return <main className="p-6"><p className="text-emerald-700">Loading orders...</p></main>;
    if (error) return <main className="p-6"><p className="text-red-500">{error}</p></main>;

    return (
        <main className="p-6">
            <h1 className="text-3x1 font-serif font-bold text-emerald-900 mb-6">Vendor Orders</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500">No incoming orders found.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                            <h2 className="text-xl font-serif font-bold text-emerald-900">Order #{order.id.slice(-6)}</h2>
                            <p className="text-gray-600">Status: <span className="text-emerald-600 font-bold">{order.status}</span></p>

                            <button
                                onClick={() => handleMarkStarted(order.id)}
                                disabled={order.status === "Started"}
                                className={`w-40 py-2 rounded-full font-bold text-white transition-all
                                    ${order.status === "Started"
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-emerald-500 hover:bg-emerald-600"}`}
                            >
                                {order.status === "Started" ? "Started" : "Mark Started"}
                            </button>

                            <div className="mt-2">
                                <h3 className="text-lg font-serif font-bold text-emerald-800 mb-2">Items:</h3>
                                {order.items?.map((item) => (
                                    <div key={item.id} className="bg-emerald-50 rounded-lg p-3 mb-2">
                                        <p className="font-bold text-emerald-900">{item.product?.name}</p>
                                        <p className="text-emerald-600">${item.product?.price?.toFixed(2)}</p>
                                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
