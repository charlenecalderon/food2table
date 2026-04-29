"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu } from "lucide-react";

export default function NavBar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  const menuLinks = [
    { href: "/vendor-dashboard", label: "Vendor Dashboard" },
    { href: "/orders", label: "Orders" },
    { href: "/browse", label: "Browse" },
    { href: "/about", label: "About" },
  ];

  return (
    <div className="w-full">
      {/* BANNER */}
      <div className="w-full h-40 md:h-52 overflow-hidden border-b-4 border-emerald-900">
        <img
          className="w-full h-full object-cover"
          src="/banneropt3.png"
          alt="Fresh2Table Banner"
        />
      </div>

      {/* NAVIGATION BAR */}
      <nav className="bg-green-200 px-8 py-3 border-b border-emerald-200 flex items-center justify-between relative">

        {/* LEFT — Logo with dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-xl font-serif font-bold text-emerald-900 tracking-tight cursor-pointer hover:text-emerald-700 transition-colors"
          >
            <Menu size={22} />
            fresh2table
          </button>

          {menuOpen && (
            <div className="absolute left-0 mt-3 w-52 bg-white rounded-xl shadow-lg border border-emerald-100 z-50 overflow-hidden">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="px-5 py-3 text-sm font-semibold text-emerald-900 hover:bg-green-100 transition-colors cursor-pointer">
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Icons */}
        <div className="flex items-center gap-5">

          {/* Search */}
          {searchOpen ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearchOpen(false);
                router.push(`/browse?q=${encodeURIComponent(searchQuery)}`);
                setSearchQuery("");
              }}
              className="flex items-center gap-2"
            >
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="border border-emerald-300 rounded-full px-4 py-1 text-sm text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-400 w-48"
              />
              <button type="submit" className="text-emerald-800 hover:text-emerald-600 transition-colors">
                <Search size={20} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-emerald-800 hover:text-emerald-600 transition-colors"
            >
              <Search size={20} />
            </button>
          )}

          {/* Cart with badge */}
          <Link href="/cart">
            <button className="relative text-emerald-800 hover:text-emerald-600 transition-colors">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-emerald-700 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
          </Link>

          {/* Account icon */}
          <button
            onClick={handleProfileClick}
            className="text-emerald-800 hover:text-emerald-600 transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </nav>
    </div>
  );
}
