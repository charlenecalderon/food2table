"use client";

import { useState } from "react";
import NavBar from "../../components/NavBar";

export default function VendorDashboardPage() {

    const [vendorItems, setVendorItems] = useState([
        { id: 1, name: "Krabby Patty", price: 1.99, quantity: 1 },
        { id: 2, name: "Kelp Shake", price: 2.99, quantity: 2 },
        { id: 3, name: "One Cube of Ice", price: 3.99, quantity: 3 }
    ]);

    return (
        <main>
        <NavBar />
        <div className="p-6">
            <h1 className="text-3x1 font-serif font-bold text-emerald-900 mb-6">Vendor Dashboard</h1>

            <div className="bg-white rounded-x1 shadow p-4 mb-6">
                <h2 className="text-xl font-serif font-bold text-emerald-900 mb-2">Account</h2>
                <p className="text-gray-600">Vendor Name: <span className="text-emerald-700 font-bold">Spongebob Squarepants</span></p>
                <p className="text-gray-600">Email: <span className="text-emerald-700">SpongebobSquarepants@gmail.com</span></p>
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

                        {vendorItems.map((item) => (
                            <tr key={item.id} className="border-b border-emerald-50">
                                <td className="py-2 text-gray-700">{item.name}</td>
                                <td className="py-2 text-emerald-600 font-bold">${item.price.toFixed(2)}</td>
                                <td className="py-2 text-gray-700">{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <a
                    href="/vendor/orders-vendor"
                    className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold hover:bg-emerald-600 transition-all"
                >
                    View Orders
                </a>
            </div>

        </div>
        </main>
    );
}