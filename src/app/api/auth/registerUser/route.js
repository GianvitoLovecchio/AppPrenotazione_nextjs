import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

//creo la connessione al db
const prisma = new PrismaClient();

//funzione per ottenere tutti gli utenti
export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return Response.json(users)
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

//funzione per creare un nuovo utente
export async function POST(req) {
    try {
        const body = await req.json();

        //hash della password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                name: body.nome,
                surname: body.cognome,
                role: body.ruolo,
                password: hashedPassword
            }
        });

        // Genera il token JWT
        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                name: newUser.name,
                surname: newUser.surname,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Salva il token nei cookie
        cookies().set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60, // 1h
            path: "/",
        });

        return new Response(JSON.stringify({ success: true, user: newUser }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
