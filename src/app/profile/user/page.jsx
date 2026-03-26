
import NavBar from "../../../components/NavBar";
import Profile from "../../../components/Profile";

export default function User() {
return(
    <div className="bg-emerald-50 min-h-screen w-screen object-fill">
        <h1>WORK IN PROGRESS, LIKELY PROTOTYPE 2</h1>
        <NavBar />
        <div className="flex w-full justify-center">
        <Profile className="justify-start w-1/4" />
        <div className="justify-end w-3/4 right-1/2 transform -inset-2 translate-x-1/8 px-10 py-5">
        <div className="flex-col items-center mb-6 bg-emerald-100 p-6 rounded-lg shadow-md">
            <h1 className="font-bold font-serif text-emerald-600 text-3xl mb-4">Profile View</h1>
            <p className="text-emerald-700 font-serif text-lg">Welcome to your profile page! Here you can view and manage your account details, order history, and saved items. Use the navigation on the left to access different sections of your profile.</p>
            <hr className="w-full border-emerald-500 mt-4 mb-4" />
            <h2 className="font-bold font-serif text-emerald-600 text-2xl mb-3">Your Information</h2>
            <hr className="w-full border-emerald-500 mt-2 mb-2" />
            <form>
            <h3 className="font-bold font-serif text-emerald-700 text-lg">Name</h3>
            <input type="text" className="w-full p-2 border border-emerald-300 rounded mb-4" placeholder="Enter your name" />
            <h3 className="font-bold font-serif text-emerald-700 text-lg">Username</h3>
            <input type="text" className="w-full p-2 border border-emerald-300 rounded mb-4" placeholder="Enter your username" />
            <h3 className="font-bold font-serif text-emerald-700 text-lg">Bio</h3>
            <textarea className="w-full p-2 border border-emerald-300 rounded mb-4" placeholder="Tell us about yourself" rows="4"></textarea>
            <h3 className="font-bold font-serif text-emerald-700 text-lg">Account Type</h3>
            <select className="w-full p-2 border border-emerald-300 rounded mb-4">
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
            </select>
            <button className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-[0_4px_0_0_rgba(5,150,105,1)] hover:translate-y-0.5 active:shadow-none transition-all">
                Save Changes
            </button>
            </form>
        </div>
        </div>
        </div>
    </div>
)
}