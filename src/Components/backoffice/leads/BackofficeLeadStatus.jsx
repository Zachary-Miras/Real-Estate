"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const OPTIONS = [
	{ value: "NEW", label: "Nouveau" },
	{ value: "IN_PROGRESS", label: "En cours" },
	{ value: "DONE", label: "Traité" },
	{ value: "SPAM", label: "Spam" },
];

export default function BackofficeLeadStatus({ leadId, initialStatus }) {
	const router = useRouter();
	const [status, setStatus] = useState(initialStatus);
	const [loading, setLoading] = useState(false);

	async function onChange(e) {
		const next = e.target.value;
		setStatus(next);
		setLoading(true);
		try {
			const res = await fetch(`/api/backoffice/leads/${leadId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: next }),
			});
			if (!res.ok) {
				alert("Impossible de mettre à jour le statut.");
				setStatus(initialStatus);
				return;
			}
			router.refresh();
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='flex items-center gap-2'>
			<select
				value={status}
				onChange={onChange}
				disabled={loading}
				className='h-10 px-3 rounded-xl border border-white/15 bg-white/10 text-white outline-none disabled:opacity-70'>
				{OPTIONS.map((o) => (
					<option key={o.value} value={o.value} className='text-black'>
						{o.label}
					</option>
				))}
			</select>
			{loading ? <span className='text-xs text-white/60'>…</span> : null}
		</div>
	);
}
