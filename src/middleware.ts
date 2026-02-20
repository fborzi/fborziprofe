// src/middleware.ts
// import { defineMiddleware } from "astro:middleware";
// import { getSupabase } from "./lib/supabase";

// export const onRequest = defineMiddleware(async (context, next) => {
//   // Le pasamos las cookies del contexto
//   const supabaseServer = getSupabase(context.cookies);
  
//   const { data: { session } } = await supabaseServer.auth.getSession();

//   const isPublicRoute = context.url.pathname === "/login" || context.url.pathname === "/auth/callback";

//   if (!session && !isPublicRoute) {
//     return context.redirect("/login");
//   }

//   // Si está logueado y va al login, al index
//   if (session && context.url.pathname === "/login") {
//     return context.redirect("/");
//   }

//   return next();
// });

import { defineMiddleware } from "astro:middleware";
import { getSupabase } from "./lib/supabase";

export const onRequest = defineMiddleware(async ({ cookies, redirect, url }, next) => {
    // Inicializamos Supabase con las cookies actuales
    const supabase = getSupabase(cookies);
    
    // Obtenemos la sesión actual de forma segura en el servidor
    const { data: { session } } = await supabase.auth.getSession();

    // 1. Proteger la ruta de estudiantes (y sus subrutas como /estudiantes/tp1)
    if (url.pathname.startsWith('/estudiantes')) {
        if (!session) {
            // Si NO hay sesión, redirigir al login
            return redirect('/login');
        }
    }

    // 2. Si el usuario YA está logueado, no tiene sentido que vea la pantalla de login
    if (url.pathname === '/login') {
        if (session) {
            // Lo enviamos directo a su panel
            return redirect('/estudiantes');
        }
    }

    // Si no se cumple ninguna de las reglas anteriores, dejamos que la petición continúe normalmente
    return next();
});