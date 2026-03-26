import "tailwindcss/tailwind.css"
import "tailwindcss/base.css"
import "tailwindcss/utilities.css"
import "tailwindcss/components.css"
import "tailwindcss/variants.css"
import NavBar from "../../components/NavBar";
import Profile from "../../components/Profile";

export default function ProfilePage() {
return(
    <div className="bg-emerald-50 min-h-screen w-screen object-fill">
        <h1>WORK IN PROGRESS, LIKELY PROTOTYPE 2</h1>
        <NavBar />
        <Profile />
    </div>
)
}