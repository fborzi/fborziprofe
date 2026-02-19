import type { APIRoute } from "astro";
import { getSupabase } from "../../lib/supabase";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const supabase = getSupabase(cookies);
  
  // Esto dispara el 'removeItem' de tu configuración y limpia las cookies
  await supabase.auth.signOut();

  return redirect("/login");
};