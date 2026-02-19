// import { defineMiddleware } from "astro:middleware";
// import { supabase } from "./lib/supabase";

// export const onRequest = defineMiddleware(async (context, next) => {
//   // 1. Obtenemos la sesión del usuario (vía cookies que maneja Supabase)
//   const { data: { session } } = await supabase.auth.getSession();

//   // 2. Definimos qué rutas NO necesitan login (login y el callback de auth)
//   const isPublicRoute = context.url.pathname === "/login" || context.url.pathname === "/auth/callback";

//   // 3. Si no hay sesión y quiere entrar a una ruta privada, al login
//   if (!session && !isPublicRoute) {
//     return context.redirect("/login");
//   }

//   // 4. Si ya está logueado y quiere ir al login, mandalo al dashboard
//   if (session && context.url.pathname === "/login") {
//     return context.redirect("/inicio");
//   }

//   return next();
// });

// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { getSupabase } from "./lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
  // Le pasamos las cookies del contexto
  const supabaseServer = getSupabase(context.cookies);
  
  const { data: { session } } = await supabaseServer.auth.getSession();

  const isPublicRoute = context.url.pathname === "/login" || context.url.pathname === "/auth/callback";

  if (!session && !isPublicRoute) {
    return context.redirect("/login");
  }

  // Si está logueado y va al login, al index
  if (session && context.url.pathname === "/login") {
    return context.redirect("/");
  }

  return next();
});