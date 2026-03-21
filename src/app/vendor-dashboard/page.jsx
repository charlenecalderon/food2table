"use client";

import { useState } from "react";

export default function VendorDashboardPage() {

    const [vendorItems, setVendorItems] = useState([
        { id: 1, name: "Item One", price: 1.99, quantity: 1 },
        { id: 2, name: "Item Two", price: 2.99, quantity: 2 },
        { id: 3, name: "Item Three", price: 3.99, quantity: 3 }
    ]);

    return (
        <main>
            <h1>Vendor Dashboard</h1>
            {/* Vendor account code */}
            <div>
                <h2>Account</h2>
                <p>Vendor Name: Spongebob Squarepants</p>
                <p>Email: SpongebobSquarepants@gmail.com</p>
            </div>

            {/* Vendor items, item quantity, and item price data */}
            <div>
                <h2>Your Items</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>

                        {/* Loop to through vendor's items and rendor the table row */}
                        {vendorItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Link to the Orders page*/}
            <div>
                <a href="/vendor/orders-vendor">View Orders</a>
            </div>

        </main>
    );
}