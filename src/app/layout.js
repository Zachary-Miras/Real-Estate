import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["400", "700"],
	display: "swap",
});

const cinzel = Cinzel({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
	display: "swap",
	variable: "--font-brand",
});

export const metadata = {
	title: "Real Estate App",
	description: "Description de votre page",
};

export default function RootLayout({ children }) {
	return (
		<html lang='fr'>
			<body
				className={`${montserrat.className} ${cinzel.variable} app-bg min-h-screen text-[color:var(--text-on-dark)]`}>
				{children}
			</body>
		</html>
	);
}
