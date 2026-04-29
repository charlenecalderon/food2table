"use client";

'use client';
<script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script>
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function NavBar() {
    const router = useRouter();
    const handleProfileClick = () => {
        const token = localStorage.getItem('token');
  
        if (token) {
            // if the has a token, they are logged in
            router.push('/profile');
        } else {
            // if empty, send them to login
            router.push('/login');
        }
    };

  return (
    <div className="w-full">
      {/* BANNER */}
      <div className="w-full h-40 md:h-52 overflow-hidden border-b-4 border-emerald-900">
        <img 
          className="w-full h-full object-cover" 
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
            <button 
            onClick={handleProfileClick}
                className="bg-emerald-800 rounded-full mt-3 mr-6 w-10 h-10 items-center flex justify-center"
        >
                <img
                  className="rounded-full w-9 h-9"
                  src="/pfp.jpg"
                  alt="Profile Picture"
                />
            </button>
              </div>
        </div>
      </nav>
    </html>
      </>
      
  );
  
  }

  