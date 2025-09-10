import { PrismaClient } from "@prisma/client";
import { getUserFromSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // Ottiengo l'utente autenticato
        const user = await getUserFromSession();
        const url = new URL(req.url);
        const businessId = url.searchParams.get("businessId");

        // Se l'utente non è autenticato, ritorno un errore
        if (!user) {
            return Response.json({ error: "Non autenticato" }, { status: 401 });
        }

        // se non c'è' businessId ritorno un errore
        if (!businessId) {
            return Response.json({ error: "Manca businessId" }, { status: 400 });
        }

        // Ottengo tutte le attività dell'utente
        const categories = await prisma.service.findMany({
            // prendo tutte le attività dell'utente
            where: {
                businessId: Number(businessId)
            },
            // prendiamo solo la colonna category
            select: {
                category: true
            },
            // assicura valori univoci
            distinct: ["category"],
            // opzionale, ordine alfabetico
            orderBy: {
                category: "asc"
            }
        });

        return Response.json(categories);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
