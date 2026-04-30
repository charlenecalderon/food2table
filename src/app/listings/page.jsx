"use client";
import { useState, useEffect } from "react";


const API_BASE = "https://food2table-production.up.railway.app/listings";

export default function MyListingsPage() {

    const [listings, setListings] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newListing, setNewListing] = useState({
        title: "", price: "", description: ""
    });

    const [showAddForm, setShowAddForm] =useState(false);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);

                const userId = localStorage.getItem("userId");

                const res = await fetch(`${API_BASE}/vendorlistings/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch listings");

                const data = await res.json();
                setListings(data.listings);
            } catch (err) {
                console.error("Error fetching listings:" , err);
                setError("Could not load listings. Please try again.");
            } finally {
                setLoading(false);
            }
    };

        fetchListings();
    }, []);

    const handleDelete = async (id) => {
        try { 
            const res = await fetch(`${API_BASE}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if(!res.ok) throw new Error ("Failed to delete listings");

            setListings(listings.filter(listing => listing.id !== id));
        } catch (err) {
            console.error("Error deleting listing:", err);
            alert("Could not delete listing. Please try again.");
        }
    };

    const handleEditStart = (listing) => {
        setEditingId(listing.id);
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
                    title: updatedListing.title,
                    description: updatedListing.description,
                    price: parseFloat(updatedListing.price),
                }),
            });

            if(!res.ok) throw new Error("Failed to update listing");

            const data = await res.json();

            setListings (listings.map(listing =>
                listing.id === id ? data.listing : listing
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
                    title: newListing.title,
                    description: newListing.description,
                    price: parseFloat(newListing.price),
                }),
            });

            if (!res.ok) throw new Error("Failed to add listing");

            const data = await res.json();

            setListings([...listings, data.listing]);
            setNewListing({ title: "", price: "", quantity: "", description: ""});
            setShowAddForm(false);
         } catch (err) {
            console.error("Error adding listing:", err);
            alert("Could not add listing. Please try again.");
         }
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
                    <button
                        onClick={handleAdd}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-600 w-fit"
                    >
                        Add Listing
                    </button>
                    </div>
                </div>
            )}

            {loading && <p className="text-emerald-700">Loading listings....</p>}
            {error && <p className="text-red-500">{error}</p>}
        
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
                        <h2 className="text-xl font-serif font-bold text-emerald-900">{listing.title}</h2>
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

</main>
    );
}

function EditForm({ listing, onSave, onCancel }) {
    const [form, setForm] = useState({
        title: listing.title,
        price: listing.price,
        description: listing.description,
    });

    return (
        <div className="flex flex-col gap-2">
            <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
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