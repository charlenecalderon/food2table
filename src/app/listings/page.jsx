"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import NavBar from "../../components/NavBar";
import Link from "next/link";

const API_BASE = "https://food2table-production.up.railway.app/products";

export default function MyListingsPage() {
    const [listings, setListings] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [newListing, setNewListing] = useState({
        title: "", price: "", description: ""
    });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/my-products`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch listings");
                const data = await res.json();
                setListings(data.products.map(p => ({ ...p, title: p.name })));
            } catch (err) {
                console.error("Error fetching listings:" , err);
                setError("Could not load listings. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    const handleImageUpload = async (file, onSuccess) => {
        setUploading(true);
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from("listing-images")
            .upload(fileName, file, { upsert: true });
        if (uploadError) {
            alert("Image upload failed, please try again later.");
            setUploading(false);
            return;
        }
        const { data: urlData } = supabase.storage
            .from("listing-images")
            .getPublicUrl(fileName);
        onSuccess(urlData.publicUrl);
        setUploading(false);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!res.ok) throw new Error("Failed to delete listing");
            setListings(listings.filter(listing => listing.id !== id));
        } catch (err) {
            console.error("Error deleting listing:", err);
            alert("Could not delete listing. Please try again.");
        }
    };

    const handleEditSave = async (id, updatedListing) => {
        try {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: updatedListing.title,
                    description: updatedListing.description,
                    price: parseFloat(updatedListing.price),
                }),
            });
            if (!res.ok) throw new Error("Failed to update listing");
            const data = await res.json();
            setListings(listings.map(listing =>
                listing.id === id ? { ...data.product, title: data.product.name } : listing
            ));
            setEditingId(null);
        } catch (err) {
            console.error("Error updating listing:", err);
            alert("Could not update listing. Please try again.");
        }
    };

    const handleAdd = async () => {
        try {
            const res = await fetch(`${API_BASE}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: newListing.title,
                    description: newListing.description,
                    price: parseFloat(newListing.price),
                    imageUrl: newListing.imageUrl || "",
                    stock: newListing.quantity ? parseInt(newListing.quantity) : 0,
                }),
            });
            if (!res.ok) throw new Error("Failed to add listing");
            const data = await res.json();
            setListings([...listings, { ...data.product, title: data.product.name }]);
            setNewListing({ title: "", price: "", quantity: "", description: "", imageUrl: "" });
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding listing:", err);
            alert("Could not add listing. Please try again.");
        }
    };

    return (
        <div className="bg-emerald-50 min-h-screen">
            <NavBar />
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/browse" className="text-emerald-900 font-bold hover:underline">← Back</Link>
                    <h1 className="text-2xl font-serif font-bold text-emerald-900">My Listings</h1>
                </div>

                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="mb-6 bg-emerald-900 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700"
                >
                    {showAddForm ? "Cancel" : "+ Add New Listing"}
                </button>

                {showAddForm && (
                    <div className="bg-green-200 rounded-xl p-4 mb-6">
                        <h2 className="text-xl font-serif font-bold text-emerald-900 mb-4">New Listing</h2>
                        <div className="flex flex-col gap-2">
                            <input type="text" placeholder="Listing Title" value={newListing.title}
                                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                                className="border border-emerald-200 rounded-lg p-2" />
                            <input type="number" placeholder="Price" value={newListing.price}
                                onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                                className="border border-emerald-200 rounded-lg p-2" />
                            <input type="number" placeholder="Quantity Available" value={newListing.quantity}
                                onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                                className="border border-emerald-200 rounded-lg p-2" />
                            <input type="text" placeholder="Description" value={newListing.description}
                                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                                className="border border-emerald-200 rounded-lg p-2" />
                            <label className="text-sm font-semibold text-emerald-900">Photo</label>
                            <input type="file" accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        handleImageUpload(e.target.files[0], (url) =>
                                            setNewListing((prev) => ({ ...prev, imageUrl: url }))
                                        );
                                    }
                                }}
                                className="border border-emerald-200 rounded-lg p-2" />
                            {uploading && <p className="text-sm text-emerald-600">Uploading image...</p>}
                            {newListing.imageUrl && (
                                <img src={newListing.imageUrl} alt="Preview" className="h-32 rounded-lg object-cover w-full" />
                            )}
                            <button onClick={handleAdd} disabled={uploading}
                                className="bg-emerald-900 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700 w-fit disabled:opacity-50">
                                Add Listing
                            </button>
                        </div>
                    </div>
                )}

                {loading && <p className="text-emerald-900 font-serif">Loading listings...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="flex flex-col gap-4">
                    {listings.map((listing) => (
                        <div key={listing.id} className="bg-green-200 rounded-xl p-4">
                            {editingId === listing.id ? (
                                <EditForm listing={listing} onSave={handleEditSave} onCancel={() => setEditingId(null)} />
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {listing.imageUrl && (
                                        <img src={listing.imageUrl} alt={listing.title} className="h-56 rounded-lg object-contain w-full mb-2 bg-gray-50" />
                                    )}
                                    <h2 className="text-xl font-serif font-bold text-emerald-900">{listing.title}</h2>
                                    <p className="text-emerald-900 font-bold">${listing.price.toFixed(2)}</p>
                                    <p className="text-emerald-900 font-serif text-sm">{listing.description}</p>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => setEditingId(listing.id)}
                                            className="bg-emerald-900 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-700">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(listing.id)}
                                            className="bg-red-400 text-white px-4 py-1 rounded-full font-bold hover:bg-red-500">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EditForm({ listing, onSave, onCancel }) {
    const [form, setForm] = useState({
        title: listing.title,
        price: listing.price,
        description: listing.description,
    });
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (file) => {
        setUploading(true);
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from("listing-images")
            .upload(fileName, file, { upsert: true });
        if (uploadError) {
            alert("Image upload failed, please try again later.");
            setUploading(false);
            return;
        }
        const { data: urlData } = supabase.storage
            .from("listing-images")
            .getPublicUrl(fileName);
        setForm((prev) => ({ ...prev, imageUrl: urlData.publicUrl }));
        setUploading(false);
    };

    return (
        <div className="flex flex-col gap-2">
            <input type="text" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border border-emerald-200 rounded-lg p-2" />
            <input type="number" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border border-emerald-200 rounded-lg p-2" />
            <input type="text" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border border-emerald-200 rounded-lg p-2" />
            <label className="text-sm font-semibold text-emerald-900">Photo</label>
            <input type="file" accept="image/*"
                onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                className="border border-emerald-200 rounded-lg p-2" />
            {uploading && <p className="text-sm text-emerald-600">Uploading image...</p>}
            {form.imageUrl && (
                <img src={form.imageUrl} alt="Preview" className="h-32 rounded-lg object-cover w-full" />
            )}
            <div className="flex gap-2">
                <button onClick={() => onSave(listing.id, form)} disabled={uploading}
                    className="bg-emerald-900 text-white px-4 py-1 rounded-full font-bold hover:bg-emerald-700 disabled:opacity-50">
                    Save
                </button>
                <button onClick={onCancel}
                    className="bg-gray-400 text-white px-4 py-1 rounded-full font-bold hover:bg-gray-500">
                    Cancel
                </button>
            </div>
        </div>
    );
}
