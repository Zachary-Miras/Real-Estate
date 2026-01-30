import { Header } from "@/Components/Header";
import SignOutButton from "@/Components/SignOutButton";
import { authOptions } from "@/services/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
	title: "Profil | Real Estate",
	description: "Votre espace personnel.",
};

export default async function ProfilePage() {
	const session = await getServerSession(authOptions);
	if (!session) redirect("/login");

	return (
		<div className='min-h-screen'>
			<Header />
			<main className='px-6 md:px-12 pt-10 pb-20'>
				<div className='max-w-3xl mx-auto glass rounded-3xl p-8 md:p-10'>
					<div className='text-2xl md:text-3xl font-bold text-white'>
						Mon profil
					</div>
					<div className='mt-2 text-white/70'>
						Connecté en tant que{" "}
						<span className='font-semibold text-white'>
							{session.user?.email}
						</span>
					</div>

					<div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='glass rounded-2xl p-5'>
							<div className='text-xs uppercase tracking-widest text-white/60'>
								Nom
							</div>
							<div className='mt-2 text-white font-semibold'>
								{session.user?.name || "—"}
							</div>
						</div>

						<div className='glass rounded-2xl p-5'>
							<div className='text-xs uppercase tracking-widest text-white/60'>
								Rôle
							</div>
							<div className='mt-2 text-white font-semibold'>
								{session.user?.role || "USER"}
							</div>
						</div>
					</div>

					<div className='mt-8 flex justify-end'>
						<SignOutButton />
					</div>
				</div>
			</main>
		</div>
	);
}
