import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getUserFromSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
        return { loggedIn: false, role: null };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return {
            loggedIn: true,
            id: decoded.id,
            name: decoded.name,
            surname: decoded.surname,
            role: decoded.role
        };
    } catch {
        return { loggedIn: false, role: null };
    }
}
