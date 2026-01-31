/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				text: "#050316",
				background: "#F0F0F0",
				primary: "#A3C4F3",
				secondary: "#1D3557",
				accent: "#675adb",
			},

			fontFamily: {
				montserrat: ["Montserrat", "sans-serif"],
			},
		},
	},
	plugins: [],
};
