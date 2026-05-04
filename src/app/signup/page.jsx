"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  // username is used to create a profile for the vendor dashboard
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // create the user account
    const response = await fetch('https://food2table-production.up.railway.app/users', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    if (response.status !== 201) {
      const errorData = await response.json();
      setError(errorData.message);
      return;
    }

    // auto-login to get a token
    const loginRes = await fetch('https://food2table-production.up.railway.app/users/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    });

    if (!loginRes.ok) {
      setSuccess("Account created! Please log in.");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    const userId = loginData.user?.id;
    localStorage.setItem("token", token);
    if (userId) localStorage.setItem("userId", userId);

    // create the profile using the username so vendor dashboard can show the vendor name
    await fetch('https://food2table-production.up.railway.app/profiles', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.username,
        contactInfo: formData.email,
      }),
    });

    setSuccess("Account created successfully!");
    setTimeout(() => router.push("/browse"), 2000);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md flex flex-col gap-5">
        <h1 className="text-2xl font-serif font-bold text-emerald-900 text-center">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-emerald-900">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter your username"
              className="border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

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

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-emerald-600 text-sm text-center">{success}</p>}

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