// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const getSupabase = (cookieContext?: any) => {
  return createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        flowType: 'pkce',
        storage: {
          getItem: (key) => {
            if (cookieContext) return cookieContext.get(key)?.value || null;
            if (typeof document !== 'undefined') {
              const cookie = document.cookie.split('; ').find(row => row.startsWith(`${key}=`));
              return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
            }
            return null;
          },
          // AGREGAMOS ESTO: Ahora el servidor SÍ puede escribir la cookie
          setItem: (key, value) => {
            if (cookieContext) {
              cookieContext.set(key, value, { path: "/", sameSite: "lax", secure: import.meta.env.PROD });
            } else if (typeof document !== 'undefined') {
              document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=3600; SameSite=Lax`;
            }
          },
          removeItem: (key) => {
            if (cookieContext) cookieContext.delete(key, { path: "/" });
            else if (typeof document !== 'undefined') document.cookie = `${key}=; path=/; max-age=0`;
          }
        }
      }
    }
  );
};
export const supabase = getSupabase();