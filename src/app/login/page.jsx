"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState ("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('https://food2table-production.up.railway.app/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      router.push('/');
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md flex flex-col gap-5">
        <h1 className="text-2xl font-serif font-bold text-emerald-900 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-emerald-900">
              Email or Username
            </label>
            <input
              type="text"
              placeholder="Enter your email or username"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-emerald-900">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="bg-emerald-500 text-white py-2 rounded-full font-bold hover:bg-emerald-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}