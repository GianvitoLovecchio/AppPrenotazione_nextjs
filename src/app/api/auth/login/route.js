import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

//creo la connessione al db
const prisma = new PrismaClient();

//funzione per il login
export async function POST(req) {
    try {
        //estraggo il corpo della richiesta assegnandolo alla variabile body
        const body = await req.json();
        //estraggo email e password dal corpo della richiesta
        const { email, password } = body;
        //cerco l'utente nel db
        const user = await prisma.user.findUnique({ where: { email } });
        //se l'utente non esiste ritorno un errore
        if (!user) {
            return new Response(JSON.stringify({ error: "Utente non trovato" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }
        //controllo se la password criptata con bcrypt è corretta
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: "Password errata" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        console.log("JWT_SECRET =", process.env.JWT_SECRET);
        //creo il token JWT per l'autenticazione
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name, surname: user.surname },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        //salvo il token nei cookie
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60, // 1h
            path: "/",
        });

        //ritorno il token
        return new Response(JSON.stringify({ token }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return Response.json(
            { success: true },
            {
                status: 200,
                headers: {
                    "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600; ${process.env.NODE_ENV === "production" ? "Secure; SameSite=Lax" : ""
                        }`,
                },
            }
        );
    }
}