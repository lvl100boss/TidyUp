import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
    // server: {
    //     host: "0.0.0.0", // listen on all interfaces
    //     port: 5173,
    //     hmr: {
    //         host: "192.168.1.94", // <- your LAN IP
    //         protocol: "ws",
    //         port: 5173,
    //     },
    // },
});

// php artisan serve --host=0.0.0.0 --port=8000
