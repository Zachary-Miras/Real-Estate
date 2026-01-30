"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const STATUSES = [
	{ value: "DRAFT", label: "Brouillon" },
	{ value: "PUBLISHED", label: "Publié" },
	{ value: "SOLD", label: "Vendu" },
	{ value: "RENTED", label: "Loué" },
	{ value: "ARCHIVED", label: "Archivé" },
];

export default function BackofficePropertyStatus({ propertyId, status }) {
	const router = useRouter();
	const initial = useMemo(() => status || "DRAFT", [status]);
	const [value, setValue] = useState(initial);
	const [loading, setLoading] = useState(false);

	async function onChange(nextValue) {
		setValue(nextValue);
		setLoading(true);
		try {
			await fetch(`/api/backoffice/properties/${propertyId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: nextValue }),
			});
			router.refresh();
		} finally {
			setLoading(false);
		}
	}

	return (
		<select
			className='h-9 rounded-xl border border-white/15 bg-white/10 px-3 outline-none text-white text-sm disabled:opacity-60'
			value={value}
			disabled={loading}
			onChange={(e) => onChange(e.target.value)}>
			{STATUSES.map((s) => (
				<option key={s.value} value={s.value} className='text-black'>
					{s.label}
				</option>
			))}
		</select>
	);
}
