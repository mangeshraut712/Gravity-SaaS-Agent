/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--background-start-rgb))',
                foreground: 'rgb(var(--foreground-rgb))',
                primary: {
                    DEFAULT: 'rgb(var(--primary-rgb))',
                    foreground: '#ffffff',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--secondary-rgb))',
                    foreground: '#ffffff',
                },
                accent: {
                    DEFAULT: 'rgb(var(--accent-rgb))',
                    foreground: '#ffffff',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
