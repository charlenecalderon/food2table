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
        <div className="flex flex-wrap gap-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-green-200 rounded-xl w-72 p-4">
                    <div className="flex justify-between items-center mt-2">
                        <h2 className="text-emerald-900 font-bold font-serif">
                            {order.items?.[0]?.product?.name || "Order"}
                            {order.items?.length > 1 ? ` + ${order.items.length - 1} more` : ""}
                        </h2>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-emerald-900">
                            {order.status}
                        </span>
                    </div>
                    <p className="text-emerald-900 font-serif text-sm mt-2">
                        {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                    </p>
                </div>
            ))}
        </div>
    );
}