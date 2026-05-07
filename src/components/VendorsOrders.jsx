"use client";
import { useState, useEffect } from "react";

const API_BASE = "https://food2table-production.up.railway.app";

export default function VendorOrders() {
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

    if (loading) return <p className="text-emerald-700">Loading vendor orders...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (orders.length === 0) return <p className="text-gray-500">No vendor orders found.</p>;

    return (
        <div className="flex flex-col gap-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-green-200 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-emerald-900">
                            {order.status}
                        </span>
                        <p className="text-emerald-700 text-xs">
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div className="mt-3">
                        <p className="text-emerald-900 font-bold font-serif">Buyer: {order.buyer?.profile?.name || order.buyer?.email || "Unknown"}</p>
                        <p className="text-emerald-800 text-sm">{order.buyer?.email}</p>
                    </div>

                    <div className="mt-3">
                        <p className="text-emerald-900 font-serif text-sm font-bold mb-1">Items:</p>
                        {order.items?.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm text-emerald-900">
                                <span>{item.product?.name}</span>
                                <span>x{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}