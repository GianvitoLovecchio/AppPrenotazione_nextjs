import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    // Qui salvi i dati dell'attività
    const business = await prisma.business.create({
      data: {
        name: body.name,
        category: body.category,
        ownerId: body.ownerId,
        email: body.email,
        address: body.address,
        city: body.city,
        phone: body.phone,
        website: body.website,
        description: body.description,
        piva: body.piva,
        logo: body.logo,
      },
    });

    // Se vuoi creare un cookie subito (es. sessione)
    const cookieStore = await cookies();
    cookieStore.set({
      name: "lastCreatedBusiness",
      value: business.id.toString(),
      httpOnly: true,
      path: "/",
    });

    return new Response(JSON.stringify(business), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
