import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const fieldsToCheck = await prisma.business.findMany({
      distinct: ["category"],
      select: { category: true, piva: true , email: true},
      orderBy: { category: "asc" },
    });
        // prende solo il campo category generando un array di stringhe
        // const categories = categoryList.map(category => category.category);
        console.log(fieldsToCheck);
        return Response.json(fieldsToCheck)
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}