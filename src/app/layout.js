import Head from "next/head";
import "./globals.css";

export const metadata = {
	title: "Real Estate App",
	description: "Description de votre page",
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<Head>
				<link
					href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<body className='bg-white at-b font-montserrat min-h-screen'>
				{children}
			</body>
		</html>
	);
}
