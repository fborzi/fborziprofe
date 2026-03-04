import type { APIRoute } from "astro";
import { getSupabase } from "../../lib/supabase";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
    const authCode = url.searchParams.get("code");

    if (!authCode) {
        return new Response("No se proporcionó un código de autorización", { status: 400 });
    }

    const supabase = getSupabase(cookies);
    const { error } = await supabase.auth.exchangeCodeForSession(authCode);

    if (error) {
        console.error("Error en auth callback:", error);
        return new Response("Error de autenticación: " + error.message, { status: 500 });
    }

    // ÉXITO: El usuario ya tiene la cookie de sesión.
    // Lo mandamos directamente a su panel de estudiantes.
    return redirect("/estudiantes");
};