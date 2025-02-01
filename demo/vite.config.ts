import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import svelteAnywhere from "../src";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        svelteAnywhere({
            log: true,
        }),
        svelte({
            compilerOptions: {
                customElement: true,
            }
        }),
    ],
    build: {
        target: "esnext",
        manifest: true, // Generate manifest.json for production //
        rollupOptions: {
            input: './src/main.ts', // Override default .html entry //
        },
        outDir: '../docs/public/demo',
        emptyOutDir: true,
    },
    server: {
        cors: true,
    }
})
