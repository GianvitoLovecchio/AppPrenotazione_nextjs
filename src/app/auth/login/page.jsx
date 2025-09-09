"use client"

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        server: ""
    });

    const searchParams = useSearchParams();
    const [errorRedirect, setErrorRedirect] = useState(searchParams.get("errorRedirect"));
    const [messageRedirect, setMessageRedirect] = useState("");

      useEffect(() => {
        if (errorRedirect) {
            if (errorRedirect === "notLogged") {
                setMessageRedirect("Devi essere loggato per accedere a questa pagina.");
            } else if (errorRedirect === "invalidToken") {
                setMessageRedirect("Il tuo token non è valido, effettua il login.");
            }
        }
    }, [errorRedirect]);

    const validate = () => {
        const newErrors = { email: "", password: "", server: "" };

        if (!email) newErrors.email = "L'email è obbligatoria"
        else if (!email.includes("@")) newErrors.email = "L'email deve essere valida";
        else if (email.length < 8) newErrors.email = "L'email deve essere di almeno 8 caratteri";
        // else if (!users.find(user => user.email === email)) newErrors.email = "L'email non è presente nel sistema.";

        if (!password) newErrors.password = "La password è obbligatoria"
        // else if (users.find(user => user.email === email) && users.find(user => user.email === email).password !== password) newErrors.password = "Password errata";

        setErrors(newErrors);
        return Object.values(newErrors).every(value => value === "");
        ;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ email: "", password: "", server: "" });

        if (!validate()) return;

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                //resetto i campi del form
                setEmail("");
                setPassword("");
                setErrors({});
            } else {
                setErrors(prev => ({ ...prev, server: data.error }));
                return;
            }

           
            window.location.href = "/";
        } catch (error) {
            setErrors(prev => ({ ...prev, server: "Errore di connessione" }));
        }
    }


    return (
        <div>
            <h1 className="text-3xl text-center my-8 font-light">Login page</h1>

            {errorRedirect &&
            <div className="flex justify-between w-3/5 rounded-md border border-blue-500 bg-blue-100 text-blue-700 px-4 py-2 mb-4 mx-auto">
                <div className="text-md py-1" role="alert">
                    {messageRedirect}
                </div>
                <button onClick={() => setErrorRedirect(false)} className="cursor-pointer text-2xl font-bold">X</button>
            </div>
            }
            <div className="w-2/5 mx-auto">
                <form onSubmit={handleSubmit} className="border bg-blue-50 px-8 pt-8 rounded-md flex flex-col mb-4">
                    <label htmlFor="email" className="">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.email && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.email}</p>}

                    <label htmlFor="password" className="">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.password && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.password}</p>}
                    {errors.server && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.server}</p>}

                    <button type="submit" className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 my-4 rounded mx-auto">Accedi</button>
                </form>
            </div>
        </div>
    );
}