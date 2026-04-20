"use client";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/users', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    if (response.status === 201) {
      console.log("Success!");
      alert("Account created successfully!");
    } else {
      const errorData = await response.json();
      alert(errorData.message);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md flex flex-col gap-5">
        <h1 className="text-2xl font-serif font-bold text-emerald-900 text-center">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-emerald-900">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              className="border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-emerald-900">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a password"
              className="border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="bg-emerald-500 text-white py-2 rounded-full font-bold hover:bg-emerald-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}