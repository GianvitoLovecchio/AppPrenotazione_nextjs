import { PrismaClient } from "@prisma/client";
import Link from "next/link";

export default async function BusinessIndex() {

    const prisma = new PrismaClient();

    const business = await prisma.business.findMany();

    return (
        <div>
            <h1 className="text-5xl text-center my-8 font-light">Elenco attività</h1>
            <div className="flex flex-wrap justify-evenly">
                {business.map((business) => (
                    <div key={business.id} className="w-2/7 border border-black bg-garay-100 p-4 rounded-lg m-4">
                        <h2 className="text-2xl font-bold">{business.name}</h2>
                        <h6 className="text-md mt-1 font-semibold">{business.city}</h6>
                        <h6 className="text-xs mb-4 ">{business.address}</h6>
                        <p>{business.description}</p>
                        <Link className="flex justify-center mt-4" key={business.id} href={`/business/${business.id}`}>
                            <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">Scopri di più</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}