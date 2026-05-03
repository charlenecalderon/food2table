"use client";

import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";

export default function VendorDashboardPage() {

    const [vendorItems, setVendorItems] = useState([]);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        async function fetchUser() {
            try {
                const res = await fetch("https://food2table-production.up.railway.app/users/me", {
                    headers: {Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setEmail(data.user.email);
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        }
        
        async function fetchProfile(){
            try {
                const res = await fetch ("https://food2table-production.up.railway.app/profiles/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setName(data.profile.name);
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        }

        async function fetchVendorItems(userId) {
            try {
                const res =await fetch(`https://food2table-production.up.railway.app/listings/vendorlistings/${userId}`, {
                    headers : { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setVendorItems(data.listings);
                }
            } catch (err) {
                console.error("Failed to fetch vendor items:", err);
            }
        }
       
        const userId = localStorage.getItem("userId");
        fetchVendorItems (userId);
        fetchUser();
        fetchProfile();
    }, []);

    return (
        <main>
        <NavBar />
        <div className="p-6">
            <h1 className="text-3x1 font-serif font-bold text-emerald-900 mb-6">Vendor Dashboard</h1>

            <div className="bg-white rounded-x1 shadow p-4 mb-6">
                <h2 className="text-xl font-serif font-bold text-emerald-900 mb-2">Account</h2>
                <p className="text-gray-600">Vendor Name: <span className="text-emerald-700 font-bold">{name || "Loading..."}</span></p>
                <p className="text-gray-600">Email: <span className="text-emerald-700">{email || "Loading..."}</span></p>
            </div>

            <div className="bg-white rounded-xl shadow p-4 mb-6">
                <h2 className="text-xl font-serif font-bold text-emerald-900 mb-4">Your Items</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-emerald-200">
                            <th className="border-b border-emerald-200">Item Name</th>
                            <th className="border-b border-emerald-200">Price</th>
                            <th className="border-b border-emerald-200">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendorItems.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-2 text-gray-400">No items to display yet.</td>
                            </tr>
                        ) : (
                        vendorItems.map((item) => (
                            <tr key={item.id} className="border-b border-emerald-50">
                                <td className="py-2 text-gray-700">{item.name}</td>
                                <td className="py-2 text-emerald-600 font-bold">${item.price.toFixed(2)}</td>
                                <td className="py-2 text-gray-700">{item.quantity}</td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex gap-3">
                <a
                    href="/orders"
                    className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold hover:bg-emerald-600 transition-all"
                >
                    View Orders
                </a>
                <a
                    href="/listings"
                    className="bg-emerald-900 text-white px-8 py-2 rounded-full font-bold hover:bg-emerald-700 transition-all"
                >
                    My Listings
                </a>
            </div>

        </div>
        </main>
    );
}