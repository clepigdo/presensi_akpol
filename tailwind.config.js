import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                akpol: {
                    gold: "#D4A017",
                    "gold-light": "#F0C040", 
                    dim: "rgba(212,160,23,0.1)",
                    crimson: "#9B1C1C",  
                    navy: "#050A18",     
                    slate: "#8899BB",    
                },
            },
            fontFamily: {
                cinzel: ["Cinzel", "serif"],         
                cormorant: ["Cormorant Garamond", "serif"], 
                tech: ["Share Tech Mono", "monospace"], 
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            animation: {
                "spin-slow": "spin 18s linear infinite", 
            },
        },
    },

    plugins: [forms],
};
