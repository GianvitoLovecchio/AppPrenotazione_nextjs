import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default async function BusinessId({ params }) {
    const prisma = new PrismaClient();

    const businessId = Number(params.id);

    const business = await prisma.business.findUnique({
        //prende l'attività con id selezionato
        where: {
            id: businessId
        },
        //include anche i servizi associati a questa attività
        include: {
            services: true
        }
    });
    return (
        <div>
            <div className="m-4">
                <Link className="cursor-pointer text-md font-semibold hover:underline" href="/business/businessIndex">Torna all'elenco</Link>
            </div>
            <h1 className="text-5xl ml-8 my-8 mb-12 font-light">{business.name}</h1>
            <div className="mx-5 grid grid-cols-7 ">
                <Image className="col-span-2 mx-auto" src={business.logo === "public/default.jpg" ? "/default.jpg" : "/uploads/" + business.logo} alt={"logo"} width={200} height={200}></Image>
                <div className="col-span-5 mx-auto">
                    <div className="mb-6">
                        <h2 className="text-3xl font-light mb-1">Chi siamo</h2>
                        <p className="text-lg">{business.description}</p>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-3xl font-light mb-1">Dove ci troviamo</h2>
                        <p className="text-lg">Siamo a {business.city} in {business.address}</p>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-3xl font-light mb-1">I nostri contatti</h2>
                        <div className="flex gap-8">
                            <p>Telefono: <span className="font-bold">{business.phone}</span></p>
                            <p>Email: <span className="font-bold">{business.email}</span></p>
                            {business.website &&
                                <p>Sito: <span className="font-bold">{business.website}</span></p>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <h1 className="text-5xl ml-8 my-8 mb-12 font-light">I nostri servizi</h1>
            <div className="flex flex-wrap justify-evenly">
                {business.services.map((service) => (
                    <Link className="flex justify-between w-1/6 items-center  h-[100px] border border-black bg-garay-100 p-4 rounded-lg m-4 hover:scale-110 hover:border-2 transition-all duration-500" key={service.id} href={`/service/${service.id}`}>
                        <h2 className="text-2xl font-bold text-center mx-auto">{service.name}</h2>
                    </Link>
                ))}
            </div>


        </div >
    );
}