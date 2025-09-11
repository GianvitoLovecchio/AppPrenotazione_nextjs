"use client";
import { useState } from "react";
import UserDropdown from "./UserDropdown";
import MobileUserMenu from "./MobileUserMenu";
import BusinessDropdown from "./BusinessDropdown";
import Link from "next/link";

export default function Navbar({ initialUser }) {
  const [user] = useState(initialUser);
  const [isOpen, setIsOpen] = useState(false);

  console.log(user);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      
      {/* --- Sezione sinistra --- */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-md font-semibold">MyApp</Link>

        {user?.role === "owner" && (
          <BusinessDropdown user={user}/>
        )}
        
        {(!user.loggedIn || user?.role === "user") && 
          <Link href="/business/businessIndex" className="hover:underline">Elenco attività</Link>
        }
      </div>

      {/* --- Sezione destra --- */}
      <div className="flex items-center space-x-4">
        {user?.loggedIn ? (
          <UserDropdown user={user} logout={logout} />
        ) : (
          <>
            <Link href="/auth/login" className="hover:underline">Login</Link>
            <Link href="/auth/registerUser" className="hover:underline">Registrati</Link>
          </>
        )}
      </div>

      {/* --- Bottone menu mobile --- */}
      <div className="md:hidden absolute top-2 right-6">
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* --- Menu mobile --- */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-full bg-blue-600 flex flex-col items-center md:hidden space-y-2 py-2">
          <Link href="/" className="hover:underline">Home</Link>

          {user?.role === "owner" && (
            <Link href="/auth/registerBusiness" className="hover:underline">Aggiungi attività</Link>
          )}

          {user?.loggedIn ? (
            <MobileUserMenu user={user} logout={logout} />
          ) : (
            <>
              <Link href="/auth/login" className="hover:underline">Login</Link>
              <Link href="/auth/registerUser" className="hover:underline">Registrati</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
