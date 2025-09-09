// app/api/me/route.js
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ loggedIn: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return new Response(JSON.stringify({id: decoded.id, loggedIn: true, role: decoded.role, name: decoded.name, surname: decoded.surname }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ loggedIn: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
