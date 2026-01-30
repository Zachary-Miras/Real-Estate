"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function HeaderClient({
	canBackoffice,
	profileHref,
	profileLabel,
}) {
	const [open, setOpen] = useState(false);

	const links = useMemo(
		() => [
			{ href: "/", label: "Accueil" },
			{ href: "/acheter", label: "Acheter" },
			{ href: "/louer", label: "Louer" },
			{ href: "/carte", label: "Carte" },
			{ href: "/vendre", label: "Vendre" },
			{ href: "/estimation", label: "Estimation" },
			{ href: "/contact", label: "Contact" },
		],
		[],
	);

	useEffect(() => {
		if (!open) return;
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prevOverflow;
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const onKeyDown = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open]);

	return (
		<div className='lg:hidden'>
			<button
				type='button'
				onClick={() => setOpen(true)}
				className='h-10 w-10 rounded-xl border border-white/15 bg-white/10 text-white/90 hover:bg-white/15 transition-colors inline-flex items-center justify-center'
				aria-label='Ouvrir le menu'>
				<FiMenu />
			</button>

			{open ? (
				<div className='fixed inset-0 z-[80]'>
					<button
						type='button'
						className='absolute inset-0 bg-black/60'
						onClick={() => setOpen(false)}
						aria-label='Fermer le menu'
					/>

					<div className='absolute top-4 left-4 right-4 rounded-3xl border border-white/10 bg-[#0B1220]/80 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)] overflow-hidden'>
						<div className='px-4 py-3 flex items-center justify-between border-b border-white/10'>
							<div className='text-sm font-semibold text-white/90'>Menu</div>
							<button
								type='button'
								onClick={() => setOpen(false)}
								className='h-10 w-10 rounded-xl border border-white/15 bg-white/10 text-white/90 hover:bg-white/15 transition-colors inline-flex items-center justify-center'
								aria-label='Fermer le menu'>
								<FiX />
							</button>
						</div>

						<nav className='p-2'>
							{links.map((l) => (
								<Link
									key={l.href}
									href={l.href}
									onClick={() => setOpen(false)}
									className='block rounded-2xl px-4 py-3 text-white/85 hover:text-white hover:bg-white/10 transition-colors'>
									{l.label}
								</Link>
							))}
						</nav>

						<div className='p-4 border-t border-white/10 flex gap-3'>
							{canBackoffice ? (
								<Link
									href='/backoffice'
									onClick={() => setOpen(false)}
									className='flex-1 h-11 rounded-xl border border-white/15 text-white/85 hover:text-white hover:border-white/25 transition-colors inline-flex items-center justify-center font-semibold'>
									Backoffice
								</Link>
							) : null}
							<Link
								href={profileHref}
								onClick={() => setOpen(false)}
								className='btn-gold flex-1 h-11 inline-flex items-center justify-center font-semibold'>
								{profileLabel}
							</Link>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
