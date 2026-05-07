"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../components/NavBar";
import { supabase } from "../../lib/supabase";

const API_BASE = "https://food2table-production.up.railway.app";

export default function VendorDashboardPage() {

    const [vendorItems, setVendorItems] = useState([]);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [pickupInstructions, setPickupInstructions] = useState("");
    const [profileId, setProfileId] = useState("");
    const router = useRouter();

    //commenting all the code pasted from listing page starting here
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newListing, setNewListing] = useState({
        title: "", price: "", description: "", quantity: "", imageUrl: ""
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // redirect to login if not logged in
        if (!token) {
            router.push("/login");
            return;
        }

        async function fetchUser() {
            try {
                const res = await fetch(`${API_BASE}/users/me`, {
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
                const res = await fetch(`${API_BASE}/profiles/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setName(data.profile.name);
                    setLocation(data.profile.location || "");
                    setPickupInstructions(data.profile.pickupInstructions || "");
                    setProfileId(data.profile.id);
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        }
        
        async function fetchVendorItems() {
            try {
                const res = await fetch(`${API_BASE}/products/my-products`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setVendorItems(data.products);
                }
            } catch (err) {
                console.error("Failed to fetch vendor items:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchVendorItems();
        fetchUser();
        fetchProfile();
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

    const handleSaveProfile = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE}/profiles/${profileId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ location, pickupInstructions }),
            });
            if (res.ok) alert("Profile updated!");
            else alert("Failed to update profile.");
        } catch (err) {
            console.error("Failed to save profile:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if(!res.ok) throw new Error("Failed to delete product");
            setVendorItems(vendorItems.filter(item => item.id !== id));
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Could not delete product. Please try again.");
        }
    };

    // From listing page
    const handleEditStart = (listing) => {
        setEditingId(listing.id);
    };

    const handleEditSave = async (id, updatedProduct) => {
        try {
            const res = await fetch(`${API_BASE}/products/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: updatedProduct.name,
                    description: updatedProduct.description,
                    price: parseFloat(updatedProduct.price),
                }),
            });
            if(!res.ok) throw new Error("Failed to update product");
            const data = await res.json();
            setVendorItems(vendorItems.map(item =>
                item.id === id ? data.product : item
            ));
            setEditingId(null);
        } catch (err) {
            console.error("Error updating product:", err);
            alert("Could not update product. Please try again.");
        }
    };

    // From listing page
    const handleAdd = async () => {
         try {
            const res = await fetch(`${API_BASE}/products`, {
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
            setVendorItems([...vendorItems, data.product]);
            setNewListing({ title: "", price: "", quantity: "", description: "", imageUrl: "" });
            setShowAddForm(false);
         } catch (err) {
            console.error("Error adding listing:", err);
            alert("Could not add listing. Please try again.");
         }
    };

    return (
        <main>
            <NavBar />
            <div className="p-6">
                <h1 className="text-3x1 font-serif font-bold text-emerald-900 mb-6">Vendor Dashboard</h1>

                <div className="bg-white rounded-xl shadow p-4 mb-6">
                    <h2 className="text-xl font-serif font-bold text-emerald-900 mb-2">Account</h2>
                    <p className="text-gray-600">Vendor Name: <span className="text-emerald-700 font-bold">{name || "Loading..."}</span></p>
                    <p className="text-gray-600">Email: <span className="text-emerald-700">{email || "Loading..."}</span></p>
                    <div className="flex flex-col gap-2 mt-3">
                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="border border-emerald-200 rounded-lg p-2 text-sm"
                        />
                        <input
                            type="text"
                            placeholder="Pickup Instructions"
                            value={pickupInstructions}
                            onChange={(e) => setPickupInstructions(e.target.value)}
                            className="border border-emerald-200 rounded-lg p-2 text-sm"
                        />
                        <button
                            onClick={handleSaveProfile}
                            className="bg-emerald-900 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700 w-fit text-sm"
                        >
                            Save
                        </button>
                    </div>
                </div>

                <h2 className="text-3x1 font-serif font-bold text-emerald-900 mb-6" >My Listings</h2>

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
                                placeholder="Listing Title"
                                value={newListing.title}
                                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
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
                                type="text"
                                placeholder="Description"
                                value={newListing.description}
                                onChange={(e) => setNewListing({ ...newListing, description: e.target.value})}
                                className="border border-emerald-200 rounded-lg p-2"
                            />
                            <input
                                type="number"
                                placeholder="Quantity Available"
                                value={newListing.quantity}
                                onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                                className="border border-emerald-200 rounded-lg p-2"
                            />
                            <label className="text-sm font-semibold text-emerald-900">Photo</label>
                            <input type="file" accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        handleImageUpload(e.target.files[0], (url) =>
                                            setNewListing((prev) => ({ ...prev, imageUrl: url }))
                                        );
                                    }
                                }}
                                className="border border-emerald-200 rounded-lg p-2"
                            />
                            {uploading && <p className="text-sm text-emerald-600">Uploading image...</p>}
                            {newListing.imageUrl && (
                                <img src={newListing.imageUrl} alt="Preview" className="h-32 rounded-lg object-cover w-full" />
                            )}
                            <button
                                onClick={handleAdd}
                                disabled={uploading}
                                className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-600 w-fit disabled:opacity-50"
                            >
                                Add Listing
                            </button>
                        </div>
                    </div>
                )}

                {loading && <p className="text-emerald-700">Loading listings....</p>}
                {error && <p className="text-red-500">{error}</p>}
        
                <div className="flex flex-col gap-4">
                    {vendorItems.map((listing) => (
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
                                            className="bg-red-400 text-white px-4 py-1 rounded-full font-bold hover:bg-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </main>         
    );
}

function EditForm({ listing, onSave, onCancel }) {
    const [form, setForm] = useState({
        name: listing.name,
        price: listing.price,
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
