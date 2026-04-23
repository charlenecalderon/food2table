'use client';
<script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script>
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavBar() {
  return(
      <>
      <html className="min-w-screen bg-emerald-50 min-h-screen w-screen object-fill">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-w-screen">
        {/* BANNER */}
        <img
          className="w-screen border-b-4 overflow-hidden overflow-y-scroll border-emerald-900 h-40 object-cover"
          src="/banneropt3.png"
          alt="Website Banner description etc"
        />
      </body>
      {/* NAVIGATION BAR */}

      <nav className="bg-[#bbf7d0] py-4 shadow-sm flex justify-between gap-2 items-center border-b border-emerald-200">


            {/* DASHBOARD BUTTON */}
          <a href="/vendor-dashboard" className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold shadow-[0_4px_0_0_rgba(5,150,105,1)] hover:translate-y-0.5 active:shadow-none transition-all">
              Dashboard
          </a>
          <Link href="/vendor">
          <button className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold shadow-[0_4px_0_0_rgba(5,150,105,1)] hover:translate-y-0.5 active:shadow-none transition-all">
              Orders
            </button>
          </Link>

          {/* BROWSE BUTTON */}
          <Link href="/browse">
            <button className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold shadow-[0_4px_0_0_rgba(5,150,105,1)] hover:translate-y-0.5 active:shadow-none transition-all">
              Browse
            </button>
          </Link>

          {/* CART BUTTON */}
          <Link href="/cart">
            <button className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold shadow-[0_4px_0_0_rgba(5,150,105,1)] hover:translate-y-0.5 active:shadow-none transition-all">
              Cart
            </button>
          </Link>

          {/* ORDERS BUTTON */}
          <Link href="/orders">
            <button className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold shadow-[0_4px_0_0_rgba(5,150,105,1)] hover:translate-y-0.5 active:shadow-none transition-all">
              Orders
            </button>
          </Link>
  

        <div className="flex flex-col-reverse md:flex-row pr-8">
          <p className="w-full text-center mt-4 mr-8 text-3xl font-serif font-bold text-emerald-900">
            fresh2table
          </p>
          {/* ABOUT BUTTON */}
          <div className="flex justify-end md:flex-row">
            <Link href="/about">
              <button className="bg-emerald-50 hover:bg-emerald-600 text-white font-bold rounded-full mt-3 mr-4 h-10 w-10">
                <img className="w-full h-full" src="/f2t.png" alt="f2t Icon" />
              </button>
            </Link>
            {/* USER PROFILE BUTTON */}
            <Link href="/profile">
              <button className="bg-emerald-800 rounded-full mt-3 mr-6 w-10 h-10 items-center flex justify-center">
                <img
                  className="rounded-full w-9 h-9"
                  src="/pfp.jpg"
                  alt="Profile Picture"
                />
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </html>
      </>
      
  );
  
  }

  