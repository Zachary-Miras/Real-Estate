"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function onSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});
			if (res?.error) {
				setError("Email ou mot de passe incorrect.");
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
			<div className='text-2xl md:text-3xl font-bold text-white'>Connexion</div>
			<div className='mt-2 text-white/70'>Accès par email et mot de passe.</div>

			<form onSubmit={onSubmit} className='mt-8 space-y-4'>
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
						placeholder='ex: example@email.com'
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
						autoComplete='current-password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='••••••••'
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
					{loading ? "Connexion…" : "Se connecter"}
				</button>

				<div className='text-sm text-white/70'>Accès réservé (backoffice).</div>
			</form>
		</div>
	);
}
