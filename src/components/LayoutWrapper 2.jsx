"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideNav = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!hideNav && <NavBar />}
      {children}
    </>
  );
}