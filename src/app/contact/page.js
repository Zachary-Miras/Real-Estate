import { Header } from "@/Components/Header";
import MailForm from "@/Components/MailForm";
import MapWrapper from "@/Components/MapWrapper";

export const metadata = {
	title: "Contact | Real Estate",
	description: "Contactez notre agence.",
};

export default function ContactPage() {
	const markers = ["Marseille, France"];

	return (
		<div className='min-h-screen'>
			<Header />

			<section className='px-4 sm:px-6 md:px-12 pt-10 pb-10'>
				<div className='max-w-6xl mx-auto'>
					<div className='grid grid-cols-12 gap-6 md:gap-10 items-start'>
						<div className='col-span-12 lg:col-span-5 min-w-0'>
							<div className='glass rounded-3xl p-6 sm:p-8'>
								<div className='text-3xl font-bold'>Contact</div>
								<div className='mt-3 text-[color:var(--muted-on-dark)] leading-relaxed'>
									Une question, une visite, une estimation ? Écris-nous et on te
									répond rapidement.
								</div>
								<div className='mt-6 space-y-2 text-sm text-white/75'>
									<div>📍 Marseille</div>
									<div>✉️ test@test.com</div>
									<div>📞 +33 4 00 00 00 00</div>
								</div>
							</div>
						</div>

						<div className='col-span-12 lg:col-span-7 min-w-0 w-full'>
							<MailForm />
						</div>
					</div>

					<div className='mt-10 glass rounded-3xl p-4'>
						<div className='text-sm font-semibold text-white/80 mb-3'>
							Nous trouver
						</div>
						<div className='h-[340px] rounded-[22px] overflow-hidden'>
							<MapWrapper markers={markers} />
						</div>
					</div>
				</div>
			</section>

			<footer className='mt-10 bg-[#050a18] border-t border-white/10'>
				<div className='max-w-6xl mx-auto px-6 md:px-12 py-10'>
					<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
						<div>
							<div className='text-sm tracking-[0.28em] uppercase text-white/50'>
								Agence
							</div>
							<div className='text-lg font-bold'>Real Estate</div>
							<div className='mt-2 text-sm text-white/60'>
								Accompagnement premium • Achat • Vente • Estimation
							</div>
						</div>
						<div className='text-sm text-white/55'>
							© {new Date().getFullYear()} Real Estate. Tous droits réservés.
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
