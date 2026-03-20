// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: vercel({
        imageService: true, // Le dice a Vercel que use su propia API de optimización de imágenes
    }),
    integrations: [
        svelte(),
        tailwindcss()
    ],
    vite: {
        plugins: [tailwindcss()],
    }
});
