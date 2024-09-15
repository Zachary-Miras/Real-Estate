import "./globals.css";

export const metadata = {
	title: "Shop",
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={`bg-background`}>{children}</body>
		</html>
	);
}
