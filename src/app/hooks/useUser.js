// hooks/useUser.js
"use client";
import { useState, useEffect } from "react";

export default function useUser() {
  const [user, setUser] = useState(null);

  // Recupero info utente dal server
  useEffect(() => {
    async function fetchUser() {
      try {
        // richiesta al server
        const res = await fetch("/api/me", { credentials: "include" }); 
        if (!res.ok) throw new Error("Errore");
        const data = await res.json();
        if (data.loggedIn) setUser(data);
        else setUser(null);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return user;
}
