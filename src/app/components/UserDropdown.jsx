"use client";
import { useState, useRef, useEffect } from "react";

export default function UserDropdown({ user, logout }) {
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

    console.log(user);
    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white focus:outline-none"
            >
                Ciao, <span className="font-semibold ml-1">{user.name} {user.surname}</span>
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
                className={`origin-top-right absolute right-0 mt-1 w-40 sm:max-w-[calc(100%-1rem)] h-auto rounded-md shadow-lg p-4 border backdrop-blur-sm border-black z-50 transition-all duration-700 transform ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >
                <div className="py-1">
                    <button
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                        className="cursor-pointer w-full font-semibold px-4 py-2 text-sm text-center rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
