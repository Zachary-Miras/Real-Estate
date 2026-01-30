"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BackofficeDeleteButton({ propertyId }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	async function onDelete() {
		const ok = confirm("Supprimer ce bien ?\nCette action est irréversible.");
		if (!ok) return;
		setLoading(true);
		try {
			const res = await fetch(`/api/backoffice/properties/${propertyId}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				alert("Suppression refusée (admin requis) ou erreur serveur.");
				return;
			}
			router.refresh();
		} finally {
			setLoading(false);
		}
	}

	return (
		<button
			type='button'
			onClick={onDelete}
			disabled={loading}
			className='text-sm text-red-200 hover:text-red-100 underline underline-offset-4 disabled:opacity-70'>
			{loading ? "Suppression…" : "Supprimer"}
		</button>
	);
}
