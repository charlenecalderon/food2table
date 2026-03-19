import Link from 'next/link';

export default function NavBar() {
  return (
    <div className="w-full">
      {/* BANNER */}
      <div className="w-full h-40 md:h-52 overflow-hidden border-b-4 border-emerald-900">
        <img 
          className="w-full h-full object-cover" 
          src="/banner_placeholder.png" 
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

        </div>

        {/* PROFILE AREA */}
        <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-white overflow-hidden shadow-md">
           <img src="/api/placeholder/48/48" alt="Profile" />
        </div>
      </nav>
    </div>
  );
}