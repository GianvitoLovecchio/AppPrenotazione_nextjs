"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterService() {

    const serviceDurations = [{ value: "15", text: "15 min." }, { value: "30", text: "30 min." }, { value: "45", text: "45 min." }, { value: "60", text: "1 ora" }, { value: "75", text: "1 ora e 15 min" }, { value: "90", text: "1 ora e 30 min." }, { value: "105", text: "1 ora e 45 min." }, { value: "120", text: "2 ore" }, { value: "135", text: "2 ore e 15 min." }, { value: "150", text: "2 ore e 30 min." }, { value: "165", text: "2 ore e 45 min." }, { value: "180", text: "3 ore" }];

    const [errors, setErrors] = useState({});

    const [serviceList, setServiceList] = useState([]);

    const [businesses, setBusinesses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [businessId, setBusinessId] = useState("");
    const [category, setCategory] = useState("");
    const [duration, setDuration] = useState("");
    const [price, setPrice] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [addNewCategory, setAddNewCategory] = useState(false);

    const searchParams = useSearchParams();
    const [success, setSuccess] = useState(searchParams.get("success"));

    function normalizeName(str) {
        if (!str) return "";
        return str
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ""); // spazi multipli → 1 spazio
    }

    const validate = () => {
        const newErrors = {};

        const finalName = normalizeName(name);

       console.log(serviceList);

        if (!category && !addNewCategory) newErrors.category = "Seleziona una categoria o aggiungi nuova";
        if (addNewCategory && !newCategory) newErrors.newCategory = "Inserisci il nome della nuova categoria";

        if (!duration) newErrors.duration = "La durata e' obbligatoria";

        if (!price) newErrors.price = "Il prezzo e' obbligatorio";

        if (!name) newErrors.name = "Il nome e' obbligatorio";
        else if (name.length > 50) newErrors.name = "Il nome deve essere di massimo 50 caratteri";
        else if (name.length < 3) newErrors.name = "Il nome deve essere di almeno 3 caratteri";
        else if(serviceList.find(item => item === finalName)) newErrors.name = "E' già presente un servizio con questo nome nell'attività selezionata.";

        if (!description) newErrors.description = "La descrizione e' obbligatoria";
        else if (description.length > 500) newErrors.description = "La descrizione deve essere di massimo 500 caratteri";
        else if (description.length < 10) newErrors.description = "La descrizione deve essere di almeno 10 caratteri";

        if (!businessId) newErrors.businessId = "Scegliere una attività.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const finalCategory =
            addNewCategory && newCategory
                ? newCategory.charAt(0).toUpperCase() + newCategory.slice(1).toLowerCase()
                : category;

        const body = {
            businessId,
            category: finalCategory,
            duration,
            price,
            name,
            description,
        };

        try {
            const res = await fetch("/api/auth/registerService", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                //resetto i campi del form
                setBusinessId("");
                setCategory("");
                setDuration("");
                setPrice("");
                setName("");
                setDescription("");
                setErrors({});

                //redirect alla home con messaggio di successo
                window.location.href = "/auth/registerService?success=1";
            }
        } catch (error) {
            console.error(error);
        }
    }

    // fetch per ottenere tutti gli utenti dal db
    useEffect(() => {
        fetch("/api/auth/registerService", {
            method: "GET",
            // 🔑 invia automaticamente i cookie (token)
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) throw new Error("Errore nella fetch");
                return res.json();
            })
            .then(data => setBusinesses(data))
            .catch(err => console.error("Errore:", err));
    }, []);

    // fetch per ottenere tutte le categorie 
    useEffect(() => {
        if (!businessId) return;
        //[setta l'errore da mostraare]

        fetch(`/api/auth/serviceCategoryOfBusiness?businessId=${businessId}`)
            .then(res => res.json())
            .then(data => setCategories((data.map(c => c.category))))
            .catch(err => console.error(err));
    }, [businessId]);


    useEffect(() => {
        if (!businessId) return;
        //[setta l'errore da mostraare]

        fetch(`/api/auth/serviceNameOfBusiness?businessId=${businessId}`)
            .then(res => res.json())
            .then(data => setServiceList(data))
            .catch(err => console.error(err));
    }, [businessId]);


    return (
        <div>
            <h1 className="text-5xl text-center my-8 font-light">Registrazione Servizio</h1>

            {success &&
                <div className="flex justify-between w-3/5 rounded-md border border-green-500 bg-green-100 text-green-700 font-semibold px-4 py-2 mb-4 mx-auto">
                    <div className="text-md py-1" role="alert">Servizio registrato con successo!</div>
                    <button onClick={() => setSuccess(false)} className="cursor-pointer text-2xl font-bold">x</button>
                </div>
            }
            <div className="w-1/2 mx-auto">
                <form onSubmit={handleSubmit} className="border bg-blue-50 px-8 pt-8 rounded-md flex flex-col mb-4">
                    <label htmlFor="name" className="">Nome servizio</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} name="nome" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.name && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.name}</p>}

                    <label htmlFor="description" className="">Descrizione</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} name="description" type="text" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white">
                    </textarea>
                    {errors.description && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.description}</p>}

                    <label htmlFor="price" className="">Prezzo</label>
                    <input value={price} onChange={(e) => setPrice(e.target.value)} name="price" type="price" className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" />
                    {errors.price && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.price}</p>}

                    <label htmlFor="duration" className="">Durata del servizio</label>
                    <select className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" value={duration} onChange={e => setDuration(e.target.value)}>
                        <option value="">Seleziona una durata</option>
                        {serviceDurations.map((duration) => (
                            <option key={duration.value} value={duration.value}>
                                {duration.text}
                            </option>
                        ))}
                    </select>
                    {errors.duration && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.duration}</p>}

                    <label htmlFor="businessId" className="">Azienda </label>
                    <select className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" value={businessId} onChange={e => setBusinessId(e.target.value)}>
                        <option value="">Seleziona una durata</option>
                        {businesses.map((business) => (
                            <option key={business.id} value={business.id}>
                                {business.name}
                            </option>
                        ))}
                    </select>
                    {errors.businessId && <p className="text-red-500 bg-red-200  rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.businessId}</p>}


                    <label htmlFor="category" className="">Categoria</label>
                    <select className="w-full border border-gray-400 p-2 rounded-md my-2 bg-white" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">Seleziona una categoria</option>
                        {categories?.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500 bg-red-200 rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.category}</p>}
                    <div className="flex justify-between">
                        <button type="button" onClick={() => setAddNewCategory(!addNewCategory)} className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-10 rounded ">Aggiungi categoria</button>
                        <input value={newCategory} type="text" name="" className="w-4/7 border px-2 border-gray-400 rounded-md py-1 bg-white" hidden={!addNewCategory} onChange={e => setNewCategory(e.target.value)} />
                    </div>
                    {errors.newCategory && <p className="text-red-500 bg-red-200 rounded-md font-bold text-sm py-1 px-5 mb-3">{errors.newCategory}</p>}


                    <button type="submit" className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 my-4 rounded mx-auto">Registrati</button>
                </form>
            </div>
        </div>
    )
}