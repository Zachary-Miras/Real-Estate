"use client";

import { useEffect, useMemo, useState } from "react";

export default function AnimatedCity({ cities, intervalMs = 2400 }) {
	const safeCities = useMemo(() => {
		const list = Array.isArray(cities) ? cities : [];
		const cleaned = list.map((c) => String(c || "").trim()).filter(Boolean);
		return cleaned.length ? cleaned : ["Paris", "Marseille", "Lyon", "Nice"];
	}, [cities]);

	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (safeCities.length <= 1) return;
		const id = setInterval(
			() => {
				setIndex((prev) => {
					if (safeCities.length <= 1) return 0;
					let next = Math.floor(Math.random() * safeCities.length);
					if (next === prev) next = (prev + 1) % safeCities.length;
					return next;
				});
			},
			Math.max(1200, Number(intervalMs) || 2400),
		);
		return () => clearInterval(id);
	}, [safeCities, intervalMs]);

	const city = safeCities[index] || safeCities[0];

	return (
		<span className='inline-flex items-baseline gap-2'>
			<span>in</span>
			<span
				key={city}
				className='inline-block text-[color:var(--accent-gold)] animate-[fadeUp_520ms_ease-out]'>
				{city}
			</span>
		</span>
	);
}
