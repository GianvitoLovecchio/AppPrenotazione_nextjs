import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req){
    try {
        const url = new URL(req.url);
        const businessId = url.searchParams.get("businessId");

        const services = await prisma.service.findMany({
            where: {
                businessId: Number(businessId)
            },
            select: {
                name: true
            }
        });

        
        const normalizedServices = services.map(s => s.name.toLowerCase().trim().replace(/\s+/g, ""));
        
        return Response.json(normalizedServices);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}