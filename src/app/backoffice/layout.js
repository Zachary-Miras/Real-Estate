import { Header } from "@/Components/Header";
import { authOptions } from "@/services/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
	title: "Backoffice | Real Estate",
	description: "Espace backoffice sécurisé.",
};

export default async function BackofficeLayout({ children }) {
	const session = await getServerSession(authOptions);
	if (!session) redirect("/login");

	const role = session?.user?.role;
	if (role !== "ADMIN" && role !== "AGENT") redirect("/login");

	return (
		<div className='min-h-screen'>
			<Header />
			<main className='px-6 md:px-12 pt-8 pb-20'>{children}</main>
		</div>
	);
}
