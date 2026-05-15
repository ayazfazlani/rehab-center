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
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#f0f7ff',
                    100: '#e0effe',
                    200: '#bae0fd',
                    300: '#7cc8fb',
                    400: '#38acf7',
                    500: '#0e91e9',
                    600: '#0273c7',
                    700: '#035ca1',
                    800: '#074f84',
                    900: '#0c426e',
                    950: '#082a4a',
                },
                boxhero: {
                    bg: '#f5f7f9', // Light mode bg
                    dark: '#1c2b36', // Dark mode sidebar
                    'dark-bg': '#f0f2f5', // Light mode inner bg
                    accent: '#2d8cf0', // Boxhero Blue
                    text: '#2c3e50',
                    muted: '#95a5a6',
                    border: '#dce3e8',
                }
            },
            backgroundColor: {
                'boxhero-navy': '#1c2b36',
                'boxhero-light': '#f5f7f9',
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
            },
            boxShadow: {
                'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }
        },
    },

    plugins: [forms],
};
