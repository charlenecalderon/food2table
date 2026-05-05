"use client";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import BuyersOrders from "../../components/BuyersOrders";
import VendorOrders from "../../components/VendorsOrders";

const API_BASE = "https://food2table-production.up.railway.app";

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState("buying");
    const [buyerOrders, setBuyerOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE}/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setBuyerOrders(data.orders);
                }
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setError("Could not load orders.");
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-[#f0fff4]">
            <NavBar />
            <main className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-6">My Orders</h1>

                {/* Tab Switcher */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab("buying")}
                        className={`px-6 py-2 rounded-full font-bold transition-all
                            ${activeTab === "buying"
                                ? "bg-emerald-500 text-white"
                                : "bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50"}`}
                    >
                        Buying
                    </button>
                    <button
                        onClick={() => setActiveTab("selling")}
                        className={`px-6 py-2 rounded-full font-bold transition-all
                            ${activeTab === "selling"
                                ? "bg-emerald-500 text-white"
                                : "bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50"}`}
                    >
                        Selling
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "buying" ? (
                    <div>
                        {loading && <p className="text-emerald-700">Loading orders...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {!loading && !error && buyerOrders.length === 0 && (
                            <p className="text-gray-500">No orders found.</p>
                        )}
                        <div className="grid gap-6">
                            {buyerOrders.map((order) => (
                                <BuyersOrders key={order.id} order={order} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <VendorOrders />
                )}
            </main>
        </div>
    );         
} 

