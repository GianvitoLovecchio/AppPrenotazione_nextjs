"use client";

import { useState, useEffect } from "react";
import useUser from "../../hooks/useUser";

export default function RegisterBusiness() {

    const user = useUser();
    const [name, setName] = useState("");
    const [piva, setPiva] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [logo, setLogo] = useState(null);
    const [newCategory, setNewCategory] = useState("");
    const [addNewCategory, setAddNewCategory] = useState(false);
    const [fieldsToCheck, setFieldsToCheck] = useState([]);
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);

    //fetch per ottenere tutti gli utenti dal db
    useEffect(() => {
        fetch("/api/auth/registerUser")
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

    //sistema validazione
    const validate = () => {
        const newErrors = {};
        const regexPhone = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
        const regexWebSite = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;

        if (!piva) newErrors.piva = "Partita IVA obbligatoria";
        else if (piva.length !== 11) newErrors.piva = "La partita IVA deve essere di 11 caratteri";
        else if(fieldsToCheck.find(item => item.piva === piva)) newErrors.piva = "La partita IVA esiste gia'";

        if (!description) newErrors.description = "Descrizione obbligatoria";
        else if (description.length < 10) newErrors.description = "La descrizione deve essere di almeno 10 caratteri";
        else if (description.length > 500) newErrors.description = "La descrizione deve essere di massimo 500 caratteri";

        if (website)
            if (website.length > 100) newErrors.website = "Il sito web deve essere di massimo 100 caratteri";
            else if (!regexWebSite.test(website)) newErrors.website = "Il sito web deve essere valido";


        if (!name) newErrors.name = "Nome attività obbligatorio";
        else if (name.length < 3) newErrors.name = "Il nome deve essere di almeno 3 caratteri";
        else if (name.length > 50) newErrors.name = "Il nome deve essere di massimo 50 caratteri";

        if (!email) newErrors.email = "Email obbligatoria";
        else if (!email.includes("@")) newErrors.email = "L'email deve essere valida";
        else if (email.length < 8) newErrors.email = "L'email deve essere di almeno 8 caratteri";
        else if (fieldsToCheck.find(item => item.email === email)) newErrors.email = "L'email è già registrata";

        if (!phone) newErrors.phone = "Telefono obbligatorio";
        else if (!regexPhone.test(phone)) newErrors.phone = "Il numero di telefono deve essere valido";

        if (!city) newErrors.city = "Città obbligatoria";
        else if (city.length < 3) newErrors.city = "La città deve essere di almeno 3 caratteri";
        else if (city.length > 50) newErrors.city = "La città deve essere di massimo 50 caratteri";

        if (!address) newErrors.address = "Indirizzo obbligatorio";
        else if (address.length < 5) newErrors.address = "L'indirizzo deve essere di almeno 5 caratteri";
        else if (address.length > 100) newErrors.address = "L'indirizzo deve essere di massimo 100 caratteri";

        if (!category && !addNewCategory) newErrors.category = "Seleziona una categoria o aggiungi nuova";
        if (addNewCategory && !newCategory) newErrors.newCategory = "Inserisci il nome della nuova categoria";

        if (logo)
            if (logo.size > 1000000) newErrors.logo = "Il logo deve essere di massimo 1MB";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // fetch per ottenere tutte le categorie
    useEffect(() => {
        fetch("/api/auth/businessCategory")
            .then(res => res.json())
            .then(data => setFieldsToCheck(data))
            .catch(err => console.error(err));
    }, []);

    // funzione per creare l'attività
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        let logoFilename = "";

        // Upload logo se presente
        if (logo) {
            const formData = new FormData();
            formData.append("file", logo);
            formData.append("name", name);

            const uploadRes = await fetch("/api/uploads", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json().catch(() => null);
            if (!uploadRes.ok || !uploadData?.filename) {
                alert(uploadData?.error || "Errore durante l'upload del file");
                return;
            }
            logoFilename = uploadData.filename;
        }

        // Categoria finale
        const finalCategory =
            addNewCategory && newCategory
                ? newCategory.charAt(0).toUpperCase() + newCategory.slice(1).toLowerCase()
                : category;

        // Body della richiesta
        const body = {
            ownerId: user.id,
            name,
            email,
            phone,
            city,
            address,
            website: website || "",
            description,
            category: finalCategory,
            piva,
            logo: logo ? logoFilename : "public/default.jpg",
        };

        // Invio registrazione
        const response = await fetch("/api/auth/registerBusiness", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json().catch(() => null);
        if (response.ok) {
            alert("Attività registrata con successo!");
            // Reset form
            setName("");
            setPiva("");
            setEmail("");
            setPhone("");
            setCity("");
            setAddress("");
            setWebsite("");
            setDescription("");
            setCategory("");
            setNewCategory("");
            setAddNewCategory(false);
            setLogo(null);
        } else {
            alert(data?.error || "Impossibile registrare l'attività");
        }
    };



    return (
        <div>
            <h1 className="text-5xl text-center my-8 font-light">Registrazione attività</h1>
            <div className="w-1/2 mx-auto">
                <form onSubmit={handleSubmit} className="border bg-blue-50 px-8 pt-8 rounded-md flex flex-col mb-4">
                    <label htmlFor="name" className="">Nome Attività</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} name="nome" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.name && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.name}</p>}

                    <label htmlFor="piva" className="">Partita IVA</label>
                    <input value={piva} onChange={(e) => setPiva(e.target.value)} name="piva" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.piva && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.piva}</p>}

                    <label htmlFor="email" className="">Indirizzo email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.email && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.email}</p>}

                    <label htmlFor="phone" className="">Numero di telefono</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} name="phone" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.phone && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.phone}</p>}

                    <label htmlFor="website" className="">Sito web</label>
                    <input value={website} onChange={(e) => setWebsite(e.target.value)} name="website" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.website && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.website}</p>}

                    <label htmlFor="logo" className="">Logo</label>
                    <input onChange={(e) => setLogo(e.target.files[0])} name="logo" type="file" accept="image/*" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.logo && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.logo}</p>}

                    <label htmlFor="description" className="">Descrizione</label>
                    <input value={description} onChange={(e) => setDescription(e.target.value)} name="description" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.description && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.description}</p>}

                    <label htmlFor="address" className="">Indirizzo</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} name="address" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.address && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.address}</p>}

                    <label htmlFor="city" className="">Città</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} name="city" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.city && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.address}</p>}

                    <label htmlFor="category" className="">Categoria</label>
                    <select className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">Seleziona una categoria</option>
                        {fieldsToCheck?.map((cat, index) => (
                            <option key={index} value={cat.category}>{cat.category}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500 bg-red-200 rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.category}</p>}
                    <div className="flex justify-between">
                        <button type="button" onClick={() => setAddNewCategory(!addNewCategory)} className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-10 rounded ">Aggiungi categoria</button>
                        <input value={newCategory} type="text" name="" className="w-4/7 border border-gray-400 rounded-md py-1 bg-white" hidden={!addNewCategory} onChange={e => setNewCategory(e.target.value)} />
                    </div>
                    {errors.newCategory && <p className="text-red-500 bg-red-200 rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.newCategory}</p>}

                    <button type="submit" className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 my-4 rounded mx-auto">Registrati</button>
                </form>
            </div>
        </div>
    );
}