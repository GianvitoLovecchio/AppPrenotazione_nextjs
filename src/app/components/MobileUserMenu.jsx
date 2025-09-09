"use client";
import { useState } from "react";

export default function MobileUserMenu({ user, logout }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    return (
        <div className="flex flex-col w-full">
            {/* Saluto cliccabile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-4 py-4 text-white font-semibold flex justify-between items-centerounded-md transition"
            >
                Ciao, {user.name} {user.surname}
                <svg
                    className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Sezione espandibile */}
            {isOpen && (
                <div className="flex flex-col mx-auto py-4 mt-1 rounded-md space-y-2 bg-blue-500 w-full">
                    <button
                        onClick={() => logout()}
                        className="text-center px-12 py-2 rounded-md bg-red-500 text-white font-semibold mx-auto"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
