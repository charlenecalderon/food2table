"use client";

import Link from 'next/link';
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
      </div>
      {/* NAVIGATION BAR */}
      
      <nav className="bg-[#bbf7d0] py-4 px-8 shadow-sm flex justify-between items-center border-b border-emerald-200">
        
        <div className="flex gap-6">
            
          
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

          {/* CHECKOUT BUTTON */}
          <Link href="/checkout">
            <button className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold shadow-[0_4px_0_0_rgba(5,150,105,1)] hover:translate-y-0.5 active:shadow-none transition-all">
              Checkout
            </button>
          </Link>

        </div>

        {/* ABOUT BUTTON */}
        <div className="flex justify-end w-1/3">
        <span className=" justify-center mt-4 px-8 text-3xl font-serif font-bold text-center text-emerald-900">fresh2table</span>
        <Link href="/about">
          <button className="bg-emerald-50 hover:bg-emerald-600 text-white font-bold rounded-full mt-3 ml-4 h-10 w-10 shadow-[0_4px_0_0_rgba(5,150,105,1)] hover:translate-y-0.5 active:shadow-none transition-all">
            <img className="w-10 h-10" src="/f2t.png" alt="f2t Icon" />
          </button>
          </Link>
        {/* USER PROFILE BUTTON */}
        <button 
            onClick={handleProfileClick}
            className="bg-emerald-800 rounded-full mt-3 ml-4 w-11 h-11 items-center flex justify-center"
        >
            <img className="rounded-full w-10 h-10 m-1" src="/pfp.jpg" alt="Profile Picture" />
        </button>
        </div>
      </nav>
    </div>
  );
}