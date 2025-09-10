"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function HomeClient({ initialUser, messageRedirect, messageSuccess }) {
  const [user] = useState(initialUser);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="p-8">
      <h1 className="text-5xl text-center my-8 font-light">App delle prenotazioni</h1>

      {messageRedirect && (
        <div className="flex justify-between w-3/5 rounded-md border border-blue-500 bg-blue-100 text-blue-700 px-4 py-2 mb-4 mx-auto">
          <div className="text-md py-1" role="alert">{messageRedirect}</div>
        </div>
      )}
      {message === "not_owner" && (
        <div className="flex justify-between w-3/5 rounded-md border border-blue-500 bg-blue-100 text-blue-700 px-4 py-2 mb-4 mx-auto">
          <div className="text-md py-1" role="alert">Pagina accessibile solo ai proprietari.</div>
        </div>
      )}

      {messageSuccess && (
        <div className="flex justify-between w-3/5 rounded-md border border-green-500 bg-green-100 text-green-700 px-4 py-2 mb-4 mx-auto">
          <div className="text-md py-1" role="alert">{messageSuccess}</div>
        </div>
      )}

      <div className="flex justify-evenly h-[30vh] place-items-center gap-4">
        {!user?.loggedIn && (
          <>
            <Link href="/auth/login">
              <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-60 md:w-80">
                Login
              </button>
            </Link>
            <Link href="/auth/registerUser">
              <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-60 md:w-80">
                Registrati da utente
              </button>
            </Link>
          </>
        )}

        {user?.loggedIn && user.role === "owner" && (
          <Link href="/auth/registerBusiness">
            <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-60 md:w-80">
              Registra la tua attività
            </button>
          </Link>
        )}

        {user?.loggedIn && user.role === "user" && (
          <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-60 md:w-80">
            Benvenuto {user.name}
          </button>
        )}
      </div>
    </div>
  );
}
