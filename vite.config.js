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
    //     host: "192.168.1.94", // Replace with your local IP
    //     port: 5173,
    //     strictPort: true, // Ensure the port is strictly used
    // },
});
