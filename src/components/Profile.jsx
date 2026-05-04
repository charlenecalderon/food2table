"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://127.0.0.1:3000/users/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.user) setUser(data.user);
    })
    .catch((err) => console.error("Profile fetch error:", err));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="bg-[#f0fff4] min-h-screen w-full flex flex-col">
      <div className="px-12 py-10 w-80">
        <div className="bg-[#b9f6ca] p-5 rounded-lg shadow-sm border border-[#a1eec0]">
          
          {/* User Email at the Top */}
          <div className="mb-1 py-2 border-b border-[#8edca9]">
            <h1 className="text-[#065f46] font-serif font-bold italic">
              {user ? user.email : "Loading..."}
            </h1>
          </div>

          <div className="mb-1 py-2 border-b border-[#8edca9]">
            <Link href="/profile/user">
              <h1 className="text-[#065f46] font-serif font-bold hover:underline">Your Profile</h1>
            </Link>
          </div>

          <div className="mb-1 py-2 border-b border-[#8edca9]">
            <Link href="/profile/settings">
              <h1 className="text-[#065f46] font-serif font-bold hover:underline">Profile Settings</h1>
            </Link>
          </div>

          <div className="mb-1 py-2 border-b border-[#8edca9]">
            <Link href="/profile/history">
              <h1 className="text-[#065f46] font-serif font-bold hover:underline">Order History</h1>
            </Link>
          </div>

          <div className="mb-1 py-2 border-b border-[#8edca9]">
            <Link href="/profile/saved">
              <h1 className="text-[#065f46] font-serif font-bold hover:underline">Saved Items</h1>
            </Link>
          </div>

          <div className="py-2">
            <button onClick={handleLogout} className="w-full text-left">
              <h1 className="text-red-600 font-serif font-bold hover:text-red-800 hover:underline transition-colors">
                Log Out
              </h1>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}