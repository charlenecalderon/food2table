
"use client";
import NavBar from "../../components/NavBar";
import Profile from "../../components/Profile";
import useRequireAuth from "../../lib/useRequireAuth";

export default function ProfilePage() {
  useRequireAuth();
return(
    <>
        <NavBar />
        <Profile />
    </>
)
}