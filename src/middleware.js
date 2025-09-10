import { NextResponse } from "next/server";
import { getUserFromSession } from "./lib/auth";

export async function middleware(req) {
    const user = await getUserFromSession(req);

    if (!user || user.role !== "owner") {
        // se non è autenticato o non è proprietario, redirigi
        const url = new URL("/", req.url);
        url.searchParams.set("message", "not_owner");
        return NextResponse.redirect(new URL(url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/auth/registerBusiness",
        "/auth/registerService",
    ],
};