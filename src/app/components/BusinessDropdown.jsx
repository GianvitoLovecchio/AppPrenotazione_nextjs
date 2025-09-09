"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function UserDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    if (!user) return null;

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white focus:outline-none">
                Gestione Attività
                <svg
                    className={`ml-2 -mr-1 h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            <div
                className={`origin-top-right absolute right-0 mt-1 w-40 h-auto rounded-md shadow-lg border backdrop-blur-sm border-black z-50 transition-all duration-700 transform ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >
                <div className="cursor-pointer p-2 hover:bg-cyan-50 rounded-md">
                    <Link href="/auth/registerBusiness" className="text-blue-500 text-md font-semibold w-full hover:underline">
                        Aggiungi la tua attività
                    </Link>
                </div>
                <div className="cursor-pointer p-2 hover:bg-cyan-50 rounded-md">
                    <Link href="/auth/registerService" className="text-blue-500 text-md font-semibold hover:underline">
                        Aggiungi servizi
                    </Link>
                </div>
            </div>
        </div>
    );
}
