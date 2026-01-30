import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["400", "700"],
	display: "swap",
});

export const metadata = {
	title: "Real Estate App",
	description: "Description de votre page",
};

export default function RootLayout({ children }) {
	return (
		<html lang='fr'>
			<body
				className={`${montserrat.className} app-bg min-h-screen text-[color:var(--text-on-dark)]`}>
				{children}
			</body>
		</html>
	);
}
