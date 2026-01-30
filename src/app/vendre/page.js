import { Header } from "@/Components/Header";
import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiTrendingUp, FiZap } from "react-icons/fi";

export const metadata = {
	title: "Vendre | Real Estate",
	description:
		"Vendez votre bien avec une stratégie premium et une estimation rapide.",
};

export default function VendrePage() {
	return (
		<div className='min-h-screen'>
			<Header />

			{/* HERO */}
			<section className='px-6 md:px-12 pt-4 md:pt-8'>
				<div className='max-w-6xl mx-auto grid grid-cols-12 gap-10 items-start'>
					<div className='col-span-12 lg:col-span-6'>
						<div className='text-[44px] md:text-[56px] font-bold leading-[1.02] tracking-tight'>
							Vendez votre bien
							<br />
							au meilleur prix
						</div>
						<div className='mt-4 text-sm md:text-base text-[color:var(--muted-on-dark)] max-w-md'>
							Mise en valeur premium, diffusion ciblée et accompagnement jusqu’à
							la signature. Obtenez une estimation claire en quelques minutes.
						</div>
						<div className='mt-8 flex flex-col sm:flex-row gap-3'>
							<Link
								href='/estimation'
								className='btn-gold h-11 px-7 inline-flex items-center justify-center font-semibold'>
								Obtenir une estimation
							</Link>
							<Link
								href='/contact'
								className='h-11 px-7 inline-flex items-center justify-center font-semibold rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors'>
								Parler à un conseiller
							</Link>
						</div>
						<div className='mt-6 text-xs text-white/55'>
							Sans engagement • Réponse sous 24h • Accompagnement complet
						</div>
					</div>

					<div className='col-span-12 lg:col-span-6'>
						<div className='glass rounded-[28px] p-3'>
							<div className='relative rounded-[24px] overflow-hidden h-[320px] md:h-[420px]'>
								<Image
									src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=80'
									alt='Vendre un bien immobilier'
									fill
									sizes='(max-width: 1024px) 100vw, 520px'
									className='object-cover'
									priority
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 3 ÉTAPES */}
			<section className='px-6 md:px-12 mt-14 md:mt-20 pb-20'>
				<div className='max-w-6xl mx-auto'>
					<div className='flex items-end justify-between gap-6 mb-8'>
						<div>
							<div className='text-2xl md:text-3xl font-bold'>
								Une vente simple, maîtrisée
							</div>
							<div className='text-sm text-[color:var(--muted-on-dark)] mt-1'>
								3 étapes, une seule équipe, un suivi transparent.
							</div>
						</div>
						<Link
							href='/estimation'
							className='hidden md:inline-flex btn-gold h-11 px-7 items-center justify-center font-semibold'>
							Estimation
						</Link>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='card p-7 text-black'>
							<div className='flex items-center gap-3'>
								<div className='h-11 w-11 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center'>
									<FiTrendingUp className='text-[color:var(--accent-gold-2)] text-xl' />
								</div>
								<div>
									<div className='text-xs tracking-[0.28em] uppercase text-black/45'>
										Étape 1
									</div>
									<div className='text-lg font-bold'>
										Estimation & stratégie
									</div>
								</div>
							</div>
							<div className='mt-4 text-sm text-black/65 leading-relaxed'>
								Analyse du marché, positionnement prix et plan de diffusion.
							</div>
						</div>

						<div className='card p-7 text-black'>
							<div className='flex items-center gap-3'>
								<div className='h-11 w-11 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center'>
									<FiZap className='text-[color:var(--accent-gold-2)] text-xl' />
								</div>
								<div>
									<div className='text-xs tracking-[0.28em] uppercase text-black/45'>
										Étape 2
									</div>
									<div className='text-lg font-bold'>Mise en valeur</div>
								</div>
							</div>
							<div className='mt-4 text-sm text-black/65 leading-relaxed'>
								Photos, annonce premium, visites qualifiées et retours
								structurés.
							</div>
						</div>

						<div className='card p-7 text-black'>
							<div className='flex items-center gap-3'>
								<div className='h-11 w-11 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center'>
									<FiCheckCircle className='text-[color:var(--accent-gold-2)] text-xl' />
								</div>
								<div>
									<div className='text-xs tracking-[0.28em] uppercase text-black/45'>
										Étape 3
									</div>
									<div className='text-lg font-bold'>Signature</div>
								</div>
							</div>
							<div className='mt-4 text-sm text-black/65 leading-relaxed'>
								Négociation, compromis, notaire : on sécurise chaque étape.
							</div>
						</div>
					</div>

					<div className='mt-10 flex justify-center'>
						<Link
							href='/estimation'
							className='btn-gold h-12 px-10 inline-flex items-center justify-center font-semibold'>
							Estimer mon bien
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
