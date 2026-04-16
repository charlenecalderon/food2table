"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md flex flex-col gap-5">
        <h1 className="text-2xl font-serif font-bold text-emerald-900 text-center">
          Login
        </h1>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-emerald-900">
            Email or Username
          </label>
          <input
            type="text"
            placeholder="Enter your email or username"
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
            className="border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <button className="bg-emerald-500 text-white py-2 rounded-full font-bold hover:bg-emerald-600 transition">
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}