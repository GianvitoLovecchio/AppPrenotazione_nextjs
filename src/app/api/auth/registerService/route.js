import { PrismaClient } from "@prisma/client";
import { getUserFromSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Ottiengo l'utente autenticato
    const user = await getUserFromSession();
    console.log(user);

    // Se l'utente non è autenticato, ritorno un errore
    if (!user) {
      return Response.json({ error: "Non autenticato" }, { status: 401 });
    }

    // Ottengo tutte le attività dell'utente
    const businesses = await prisma.business.findMany({
      where: {
        ownerId: user.id,
      }
    });

    return Response.json(businesses);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newService = await prisma.service.create({
      data: {
        businessId: parseInt(body.businessId, 10),
        category: body.category,
        name: body.name,
        description: body.description,
        price: parseFloat(body.price, 2),
        duration: parseInt(body.duration, 10),
      },
    });
    return Response.json(newService);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
