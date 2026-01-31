"use client";

import emailjs from "@emailjs/browser";
import { useState } from "react";

export default function MailForm({ propertyTitle, propertyId } = {}) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState("idle"); // idle | sending | success | error
	const [statusText, setStatusText] = useState("");

	const sendEmail = async (e) => {
		e.preventDefault();

		const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
		const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
		const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

		setStatus("sending");
		setStatusText("");

		// 1) Sauvegarde du lead en base (source de vérité)
		const leadPayload = {
			name,
			email,
			phone,
			subject,
			message,
			propertyId,
			propertyTitle,
			pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
		};

		let leadOk = false;
		try {
			const leadRes = await fetch("/api/leads", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(leadPayload),
			});
			leadOk = leadRes.ok;
		} catch {
			leadOk = false;
		}

		const templateParams = {
			from_name: name,
			from_email: email,
			phone: phone,
			subject: subject,
			message: message,
		};

		// 2) Envoi email (si EmailJS configuré)
		if (!serviceId || !templateId || !userId) {
			if (leadOk) {
				setStatus("success");
				setStatusText("Message reçu. Nous te recontactons rapidement.");
				setMessage("");
				return;
			}
			setStatus("error");
			setStatusText(
				"Envoi impossible pour le moment. Réessaie dans quelques minutes.",
			);
			return;
		}

		try {
			const emailResult = await emailjs.send(
				serviceId,
				templateId,
				templateParams,
				userId,
			);
			if (process.env.NODE_ENV !== "production") {
				console.log("SUCCESS!", emailResult.status, emailResult.text);
			}
			setStatus("success");
			setStatusText("Message envoyé. Nous te recontactons rapidement.");
			setMessage("");
		} catch (err) {
			console.error("Email send failed", err);
			if (leadOk) {
				setStatus("success");
				setStatusText(
					"Message reçu. (Envoi email indisponible pour le moment.)",
				);
				setMessage("");
				return;
			}
			setStatus("error");
			setStatusText(
				"Envoi impossible pour le moment. Réessaie dans quelques minutes.",
			);
		}
	};

	const inputBase =
		"w-full h-11 rounded-xl bg-white/95 text-black px-4 outline-none border border-black/10 focus:border-[color:var(--accent-gold)] focus:ring-4 focus:ring-[color:var(--accent-gold)]/20";

	return (
		<form
			onSubmit={sendEmail}
			className='card w-full max-w-full min-w-0 p-6 md:p-8 text-black'>
			<div className='flex items-start justify-between gap-4'>
				<div>
					<div className='text-2xl font-bold'>Contacter l’agence</div>
					{propertyTitle ? (
						<div className='mt-1 text-sm text-black/60'>
							À propos de : {propertyTitle}
						</div>
					) : null}
				</div>
				<div className='text-xs text-black/45'>Réponse sous 24h</div>
			</div>

			<div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<label className='block text-sm font-semibold text-black/70 mb-1'>
						Nom
					</label>
					<input
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className={inputBase}
						placeholder='John Doe'
					/>
				</div>
				<div>
					<label className='block text-sm font-semibold text-black/70 mb-1'>
						Email
					</label>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className={inputBase}
						placeholder='example@gmail.com'
					/>
				</div>
				<div>
					<label className='block text-sm font-semibold text-black/70 mb-1'>
						Téléphone (optionnel)
					</label>
					<input
						type='tel'
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						className={inputBase}
						placeholder='+33 6 00 00 00 00'
					/>
				</div>
				<div>
					<label className='block text-sm font-semibold text-black/70 mb-1'>
						Sujet
					</label>
					<input
						type='text'
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
						required
						className={inputBase}
						placeholder='Demande de visite / Informations'
					/>
				</div>
			</div>

			<div className='mt-4'>
				<label className='block text-sm font-semibold text-black/70 mb-1'>
					Message
				</label>
				<textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					required
					rows={5}
					className={`${inputBase} h-auto py-3 resize-none`}
					placeholder='Dis-nous tes disponibilités et tes questions…'
				/>
			</div>

			<div className='mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3'>
				<div className='text-sm'>
					{status === "success" ? (
						<span className='text-emerald-700 font-semibold'>{statusText}</span>
					) : status === "error" ? (
						<span className='text-red-700 font-semibold'>{statusText}</span>
					) : (
						<span className='text-black/55'>
							En cliquant sur Envoyer, tu acceptes d’être recontacté.
						</span>
					)}
				</div>
				<button
					type='submit'
					disabled={status === "sending"}
					className='btn-gold h-11 px-6 font-semibold disabled:opacity-60 disabled:cursor-not-allowed'>
					{status === "sending" ? "Envoi…" : "Envoyer"}
				</button>
			</div>
		</form>
	);
}
