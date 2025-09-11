import { PrismaClient } from "@prisma/client";
import Link from "next/link";

export default async function ServiceId({ params }) {
    const prisma = new PrismaClient();

    const serviceId = Number(params.id);

    const service = await prisma.service.findUnique({
        //prende l'attività con id selezionato
        where: {
            id: serviceId
        },
        //include anche i servizi associati a questa attività
        include: {
            business: true
        }
    });
    return (
        <div>
            <div className="m-4">
                <Link className="cursor-pointer text-md font-semibold hover:underline " href={`/business/${service.business.id}`}>Torna all'attività {service.business.name}</Link>
            </div>
            <div className="flex justify-start">
                <h1 className="text-5xl ml-8 my-8 mb-12 font-light">{service.name}</h1>
                <h3 className="text-3xl ml-8 my-8 mb-12 font-light mt-10">({service.business.name})</h3>
            </div>

            <div className="border py-8 px-12 w-1/2 mt-12 rounded-md mx-auto">
                <h2 className="text-2xl mb-3">Descrizione: {service.description}</h2>
                <h2 className="text-2xl mb-3 ">Durata del servizio: {service.duration} min</h2>
                <h2 className="text-2xl mb-">Prezzo del servizio: {service.price} €</h2>
            </div>

        </div>
    )
}