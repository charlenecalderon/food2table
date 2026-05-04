import { useState } from 'react';

export default function VendorListingForm() {
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: Auth middleware usually expects a token here
          // 'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Listing created successfully");
      }
    } catch (error) {
      console.error("Error submitting listing:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input 
        type="text" 
        placeholder="Item Name" 
        onChange={(e) => setFormData({...formData, itemName: e.target.value})}
        className="border p-2 rounded"
      />
      <input 
        type="number" 
        placeholder="Price" 
        onChange={(e) => setFormData({...formData, price: e.target.value})}
        className="border p-2 rounded"
      />
      <textarea 
        placeholder="Description" 
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-emerald-600 text-white p-2 rounded">
        Submit Listing
      </button>
    </form>
  );
}