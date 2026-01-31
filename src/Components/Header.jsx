import { authOptions } from "@/services/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import HeaderClient from "./HeaderClient";

export async function Header({ className = "" } = {}) {
	let session = null;
	try {
		session = await getServerSession(authOptions);
	} catch {
		session = null;
	}
	const role = session?.user?.role;
	const canBackoffice = role === "ADMIN" || role === "AGENT";
	return (
		<header
			data-site-header='true'
			className={`relative z-[90] w-full px-4 sm:px-6 md:px-12 pt-4 sm:pt-6 ${className}`.trim()}>
			<div className='max-w-6xl mx-auto'>
				<div className='glass rounded-3xl px-4 sm:px-5 md:px-7 py-3 sm:py-4 flex items-center gap-4 sm:gap-6'>
					{/* Gauche */}
					<Link
						href='/'
						className='flex items-center gap-3 min-w-0 sm:min-w-[200px] hover:opacity-95 transition-opacity'
						aria-label="Retour à l'accueil">
						<div className='h-10 w-10 rounded-2xl bg-white/10 border border-white/15' />
						<div className='leading-tight'>
							<div className='hidden sm:block text-[11px] tracking-[0.28em] uppercase text-white/60'>
								Logo
							</div>
							<div className='text-base sm:text-lg font-bold tracking-wide whitespace-nowrap'>
								Real Estate
							</div>
						</div>
					</Link>

					{/* Centre */}
					<nav className='hidden lg:flex flex-1 items-center justify-center gap-7 text-sm text-white/80'>
						<Link className='hover:text-white transition-colors' href='/'>
							Accueil
						</Link>
						<Link
							className='hover:text-white transition-colors'
							href='/acheter'>
							Acheter
						</Link>
						<Link className='hover:text-white transition-colors' href='/louer'>
							Louer
						</Link>
						<Link className='hover:text-white transition-colors' href='/carte'>
							Carte
						</Link>
						<Link className='hover:text-white transition-colors' href='/vendre'>
							Vendre
						</Link>
						<Link
							className='hover:text-white transition-colors'
							href='/estimation'>
							Estimation
						</Link>
						<Link
							className='hover:text-white transition-colors'
							href='/contact'>
							Contact
						</Link>
					</nav>

					{/* Droite */}
					<div className='flex items-center gap-3 justify-end flex-1 lg:flex-none'>
						{canBackoffice ? (
							<Link
								href='/backoffice'
								className='hidden lg:inline-flex h-10 px-4 rounded-xl border border-white/15 text-white/85 hover:text-white hover:border-white/25 transition-colors items-center justify-center font-semibold'>
								Backoffice
							</Link>
						) : null}
						<Link
							href={session ? "/profil" : "/login"}
							className='hidden lg:inline-flex btn-gold px-5 h-10 items-center justify-center font-semibold'>
							{session ? "Profil" : "Connexion"}
						</Link>

						<HeaderClient
							canBackoffice={canBackoffice}
							profileHref={session ? "/profil" : "/login"}
							profileLabel={session ? "Profil" : "Connexion"}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
