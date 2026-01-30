"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function onSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				setError(data?.error || "Erreur lors de l'inscription.");
				return;
			}

			// Auto-login après création
			const login = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});
			if (login?.error) {
				router.push("/login");
				return;
			}
			router.push("/profil");
			router.refresh();
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='glass rounded-3xl p-8 md:p-10'>
			<div className='text-2xl md:text-3xl font-bold text-white'>
				Créer un compte
			</div>
			<div className='mt-2 text-white/70'>Accès par email et mot de passe.</div>

			<form onSubmit={onSubmit} className='mt-8 space-y-4'>
				<div>
					<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
						Nom (optionnel)
					</div>
					<input
						className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
						type='text'
						autoComplete='name'
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='Ton nom'
					/>
				</div>

				<div>
					<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
						Email
					</div>
					<input
						className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
						type='email'
						autoComplete='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='ex: toi@email.com'
						required
					/>
				</div>

				<div>
					<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
						Mot de passe
					</div>
					<input
						className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
						type='password'
						autoComplete='new-password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='8 caractères minimum'
						required
					/>
				</div>

				{error ? (
					<div className='text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3'>
						{error}
					</div>
				) : null}

				<button
					type='submit'
					disabled={loading}
					className='btn-gold w-full h-11 inline-flex items-center justify-center font-semibold disabled:opacity-70'>
					{loading ? "Création…" : "Créer mon compte"}
				</button>

				<div className='text-sm text-white/70'>
					Déjà un compte ?{" "}
					<Link href='/login' className='underline underline-offset-4'>
						Se connecter
					</Link>
				</div>
			</form>
		</div>
	);
}
