"use client";
import { useState } from "react";

export default function MyListingsPage() {
    
    const [listings, setListings] = useState([
        {id: 1, name: "Potatoes", price: 0.99, quantity: 100, description: "Locally grown potatoes" },
        {id: 2, name: "Tomatoes", price: 0.50, quantity: 150, description: "Freshly picked tomatoes" },
    ]);

    const [editingId, setEditingId] = useState(null);

    const [newListing, setNewListing] = useState({
        name: "", price: "", quantity: "", description: ""
    });

    const [showAddForm, setShowAddForm] = useState(false);

    const handleDelete = (id) => {
        setListings(listings.filter(listing => listing.id !== id));
    };

    const handleEditStart = (listing) => {
        setEditingId(listing.id);
    };

    const handleEditSave =(id, updatedListing) => {
        setListings(listings.map(listing =>
            listing.id === id ? {
                ...listing, 
                name: updatedListing.name,
            price: parseFloat(updatedListing.price),
            quantity:parseInt(updatedListing.quantity),
            description: updatedListing.description 
        } : listing
        ));
        setEditingId(null);
    };

    const handleAdd = () => {
        const newItem ={
            id: listings.length + 1,
            name: newListing.name,
            price: parseFloat(newListing.price),
            quantity: parseInt(newListing.quantity),
            description: newListing.description,
        };
        setListings([...listings, newItem]);
        setNewListing({ name: "", price: "", quantity: "", description: "" });
        setShowAddForm(false);
    };

    return (
        <main className='p-6'>
            <h1 className="text-3x1 font-serif font-bold text-emerald-900 mb-6" >My Listings</h1>

            <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="mb-6 bg-emerald-500 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-600"
            >
                {showAddForm ? "Cancel" : "+ Add New Listing"}
            </button>

            {showAddForm && (
                <div className="bg-white rounded-xl shadow p-4 mb-6">
                    <h2 className="text-xl font-serif font-bold text-emerald-900 mb-4">New Listing</h2>
                    <div className="flex flex-col gap-2">
                        <input
                        type="text"
                        placeholder="Item Name"
                        value={newListing.name}
                        onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                        className="border border-emerald-200 rounded-lg p-2"
                    />
                        <input
                        type="number"
                        placeholder="Price"
                        value={newListing.price}
                        onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                        className="border border-emerald-200 rounded-lg p-2"
                    />
                        <input
                        type="number"
                        placeholder="Quantity"
                        value={newListing.quantity}
                        onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value})}
                        className="border  border-emerald-200 rounded-lg p-2"
                    />
                        <input
                        type="text"
                        placeholder="Description"
                        value={newListing.description}
                        onChange={(e) => setNewListing({ ...newListing, description: e.target.value})}
                        className="border border-emerald-200 rounded-lg p-2"
                    />
                    <button
                        onClick={handleAdd}className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-600 w-fit"
                    >
                        Add Listing
                    </button>
                    </div>
                </div>
            )}
        
        <div className="flex flex-col gap-4">
            {listings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-xl shadow p-4">

                    {editingId === listing.id ? (
                        <EditForm
                        listing={listing}
                        onSave={handleEditSave}
                        onCancel={() => setEditingId(null)}
                    />
                    ) : (
                        <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-serif font-bold text-emerald-900">{listing.name}</h2>
                        <p className="text-emerald-600 font-bold">${listing.price.toFixed(2)}</p>
                        <p className="text-gray-600">Quantity: {listing.quantity}</p>
                        <p className="text-gray-600">{listing.description}</p>

                        <div className="flex gap-2 mt-2">
                            <button
                            onClick={() => handleEditStart(listing)}
                            className="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-600"
                        >
                            Edit
                        </button>
                        <button
                        onClick={() => handleDelete(listing.id)}
                        className="bg-red-400 text-whote px-4 py-1 rounded-full font-bold hover:bg-red-500"
                    >
                            Delete
                        </button>
                    </div>
                </div>
            )}
            </div>
        ))}
    </div>

</main>
    );
}

function EditForm({ listing, onSave, onCancel }) {
    const [form, setForm] = useState({
        name: listing.name,
        price: listing.price,
        quantity: listing.quantity,
        description: listing.description,
    });

    return (
        <div className="flex flex-col gap-2">
            <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-emerald-200 rounded-lg p-2"
        />
            <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border border-emerald-200 rounded-lg p-2"
        />
            <input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="border border-emerald-200 rounded-lg p-2"
        />
            <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-emerald-200 rounded-lg p-2"
        />
        <div className="flex gap-2">
            <button
                onClick={() => onSave(listing.id, form)}
                className="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-600"
            >
                Save
            </button>
            <button
                onClick={onCancel}
                className= "bg-gray-400 text-white px-4 py-1 rounded-full font-bold hover:bg-gray-500"
            >
                Cancel
            </button>
        </div>
        </div>
    );
}