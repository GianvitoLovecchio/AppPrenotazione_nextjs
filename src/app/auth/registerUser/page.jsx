"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Register() {
    const router = useRouter();
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confermaPassword, setConfermaPassword] = useState("");
    const [ruolo, setRuolo] = useState("");
    //array per gli errori di validazione
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);

    //fetch per ottenere tutti gli utenti dal db
    useEffect(() => {
        fetch("/api/auth/registerUser")
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);


    //funzione per validare i campi del form
    const validate = () => {
        //oggetto per gli errori
        const newErrors = {};
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!nome) newErrors.nome = "Il nome è obbligatorio"
        else if (nome.length < 3) newErrors.nome = "Il nome deve essere di almeno 3 caratteri";

        if (!cognome) newErrors.cognome = "Il cognome è obbligatorio"
        else if (cognome.length < 3) newErrors.cognome = "Il cognome deve essere di almeno 3 caratteri";

        if (!email) newErrors.email = "L'email è obbligatoria"
        else if (!email.includes("@")) newErrors.email = "L'email deve essere valida";
        else if (email.length < 8) newErrors.email = "L'email deve essere di almeno 8 caratteri";
        else if (users.find(user => user.email === email)) newErrors.email = "L'email è già registrata";

        if (!password) newErrors.password = "La password è obbligatoria"
        else if (!passwordRegex.test(password)) newErrors.password = "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero";

        if (!confermaPassword) newErrors.confermaPassword = "La conferma della password è obbligatoria"
        else if (password !== confermaPassword) newErrors.confermaPassword = "Le password non corrispondono";

        if (!ruolo) newErrors.ruolo = "Il ruolo è obbligatorio";

        setErrors(newErrors);
        //se l'oggetto newErrors non contiene nessun errore, allora il form e' valido
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                //salvo nella variabile response la risposta del server
                const response = await fetch("/api/auth/registerUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ nome, cognome, email, password, ruolo }),
                });
                //ricevo la risposta dal server
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    //resetto i campi del form
                    setNome("");
                    setCognome("");
                    setEmail("");
                    setPassword("");
                    setConfermaPassword("");
                    setRuolo("");
                    setErrors({});
                    //redirect alla home con messaggio di successo
                    router.push("/?success=1");
                    //reload della pagina
                    // window.location.reload()
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("Ci sono errori di validazione");
        }
    }

    return (
        <div>
            <h1 className="text-5xl text-center my-8 font-light">Register page utente</h1>
            <div className="w-1/2 mx-auto">
                <form onSubmit={handleSubmit} className="border bg-blue-50 px-8 pt-8 rounded-md flex flex-col mb-4">
                    <label htmlFor="nome" className="">Nome</label>
                    <input value={nome} onChange={(e) => setNome(e.target.value)} name="nome" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.nome && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.nome}</p>}

                    <label htmlFor="cognome" className="">Cognome</label>
                    <input value={cognome} onChange={(e) => setCognome(e.target.value)} name="cognome" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.cognome && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.cognome}</p>}

                    <label htmlFor="email" className="">Indirizzo email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.email && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.email}</p>}

                    <label htmlFor="ruolo" className="">Ruolo</label>
                    <select className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" value={ruolo} onChange={(e) => setRuolo(e.target.value)} name="ruolo" id="ruolo">
                        <option value="">Seleziona il tuo ruolo</option>
                        <option value="owner">Proprietario</option>
                        <option value="user">Utente</option>
                    </select>
                    {errors.ruolo && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.ruolo}</p>}

                    <label htmlFor="password" className="">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.password && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.password}</p>}

                    <label htmlFor="confermaPassword" className="">Conferma password</label>
                    <input value={confermaPassword} onChange={(e) => setConfermaPassword(e.target.value)} name="confermaPassword" type="password" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.confermaPassword && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.confermaPassword}</p>}

                    <button type="submit" className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 my-4 rounded mx-auto">Registrati</button>
                </form>
            </div>
        </div>
    );
}
