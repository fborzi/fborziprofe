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

// import { defineMiddleware } from "astro:middleware";
// import { getSupabase } from "./lib/supabase";

// export const onRequest = defineMiddleware(async ({ cookies, redirect, url }, next) => {
//     // Inicializamos Supabase con las cookies actuales
//     const supabase = getSupabase(cookies);
    
//     // Obtenemos la sesión actual de forma segura en el servidor
//     const { data: { session } } = await supabase.auth.getSession();

//     // 1. Proteger la ruta de estudiantes (y sus subrutas como /estudiantes/tp1)
//     if (url.pathname.startsWith('/estudiantes')) {
//         if (!session) {
//             // Si NO hay sesión, redirigir al login
//             return redirect('/login');
//         }
//     }

//     // 2. Si el usuario YA está logueado, no tiene sentido que vea la pantalla de login
//     if (url.pathname === '/login') {
//         if (session) {
//             // Lo enviamos directo a su panel
//             return redirect('/estudiantes');
//         }
//     }

//     // Si no se cumple ninguna de las reglas anteriores, dejamos que la petición continúe normalmente
//     return next();
// });

import { defineMiddleware } from "astro:middleware";
import { getSupabase } from "./lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
    const url = context.url.pathname;

    // 1. CRÍTICO: IGNORAR ESTÁTICOS
    // Si es una imagen, CSS, JS o ruta interna de Astro, pasa de largo al instante sin llamar a Supabase.
    if (url.startsWith('/_astro') || url.startsWith('/favicon') || url.includes('.')) {
        return next();
    }

    // 2. CREAR CLIENTE Y OBTENER SESIÓN (Una sola vez por petición HTTP)
    const supabase = getSupabase(context.cookies);
    const { data: { session } } = await supabase.auth.getSession();

    // 3. CRÍTICO: GUARDAR EN MEMORIA (Locals)
    // Guardamos esto para que HeaderSection y los demás componentes no tengan que volver a llamar a la API
    context.locals.supabase = supabase;
    context.locals.session = session;
    context.locals.isLoggedIn = !!session;

    // 4. RUTEO PROTEGIDO
    if (url.startsWith('/estudiantes')) {
        if (!session) {
            return context.redirect('/login');
        }
    }

    if (url === '/login') {
        if (session) {
            return context.redirect('/estudiantes');
        }
    }

    return next();
});