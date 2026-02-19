import type { APIRoute } from "astro";
import { getSupabase } from "../../lib/supabase";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
    const authCode = url.searchParams.get("code");

    if (authCode) {
        // Al pasar 'cookies', 'exchangeCodeForSession' las guardará automáticamente 
        // con el nombre correcto que Supabase espera.
        const supabaseServer = getSupabase(cookies);
        const { error } = await supabaseServer.auth.exchangeCodeForSession(authCode);

        if (!error) {
            return redirect("/"); 
        }
        console.error("Error intercambio:", error.message);
    }

    return redirect("/login?error=auth-failed");
};