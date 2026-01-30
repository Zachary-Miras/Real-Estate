import { Header } from "@/Components/Header";
import RegisterForm from "@/Components/RegisterForm";
import { authOptions } from "@/services/authOptions";
import prisma from "@/services/prismaClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
	title: "Création de compte (équipe) | Real Estate",
	description: "Création de compte réservée à l'équipe.",
};

export default async function RegisterPage() {
	const session = await getServerSession(authOptions);
	const isAdmin = session?.user?.role === "ADMIN";

	if (!isAdmin) {
		const userCount = await prisma.user.count();
		// Bootstrap: aucun compte -> autorise la création du premier admin.
		if (userCount !== 0) {
			redirect("/login");
		}
	}

	return (
		<div className='min-h-screen'>
			<Header />
			<main className='px-6 md:px-12 pt-10 pb-20'>
				<div className='max-w-2xl mx-auto'>
					<RegisterForm />
				</div>
			</main>
		</div>
	);
}
