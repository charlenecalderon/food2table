import Link from 'next/link';

export default function Profile() {
    return(
        <div className="bg-emerald-50 min-h-screen w-screen object-fill flex">
         <div className="px-10 py-5 w-1/3 left-1/2 transform -inset-2 translate-x-1/8">
            <div className="flex-col items-center mb-6 bg-emerald-200 p-6 rounded-lg shadow-md">
                {/*user info here*/}
                <Link href="/profile/user">
                <button>
                <h1 className="font-bold font-serif text-emerald-700">Your Profile</h1>
                </button>
                </Link>
                <hr className="w-full border-emerald-500 mt-2 mb-2" />
                {/*profile settings here*/}
                <Link href="/profile/settings">
                <button>
                <h1 className="font-bold font-serif text-emerald-700">Profile Settings</h1>
                </button>
                </Link>
                <hr className="w-full border-emerald-500 mt-2 mb-2" />
                {/*order history here*/}
                <Link href="/profile/history">
                <button>
                <h1 className="font-bold font-serif text-emerald-700">Order History</h1>
                </button>
                </Link>
                <hr className="w-full border-emerald-500 mt-2 mb-2" />
                {/*saved items here*/}
                <Link href="/profile/saved">
                <button>
                <h1 className="font-bold font-serif text-emerald-700">Saved Items</h1>
                </button>
                </Link>
            </div>
        </div>
        
    </div>
    );
}