// src/app/page.jsx
import { getUserFromSession } from "@/lib/auth";
import HomeClient from "./components/HomeClient";

export default async function Page() {
  const user = await getUserFromSession();

  // Se devi leggere query per messaggi, puoi farlo qui lato server e passarli come prop
  const messageRedirect = "";
  const messageSuccess = "";

  return (
    <HomeClient
      initialUser={user}
      messageRedirect={messageRedirect}
      messageSuccess={messageSuccess}
    />
  );
}
