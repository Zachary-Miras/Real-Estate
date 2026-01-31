"use client";

import { getGoogleMapsLoader } from "@/services/googleMapsLoader";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	FiArrowLeft,
	FiChevronDown,
	FiChevronUp,
	FiHome,
	FiMapPin,
	FiSearch,
} from "react-icons/fi";

const MAP_STYLE_PREMIUM_MUTED = [
	// Désaturer / calmer la carte
	{
		elementType: "geometry",
		stylers: [{ saturation: -85 }, { lightness: 10 }],
	},
	{ elementType: "labels.text.fill", stylers: [{ color: "#7a828e" }] },
	{ elementType: "labels.text.stroke", stylers: [{ color: "#101826" }] },

	// Masquer la plupart des POI
	{ featureType: "poi", stylers: [{ visibility: "off" }] },
	{ featureType: "transit", stylers: [{ visibility: "off" }] },

	// Routes gris clair
	{
		featureType: "road",
		elementType: "geometry",
		stylers: [{ color: "#8b93a0" }, { lightness: 35 }, { saturation: -60 }],
	},
	{
		featureType: "road",
		elementType: "labels.text.fill",
		stylers: [{ color: "#7c8593" }],
	},

	// Eau bleu très pâle
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [{ color: "#bcd0e6" }, { lightness: 15 }, { saturation: -20 }],
	},
	{
		featureType: "water",
		elementType: "labels.text.fill",
		stylers: [{ color: "#6d7682" }],
	},
];

function formatPrice(price) {
	return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
		Number(price) || 0,
	);
}

function formatAddress(address) {
	if (!address) return "";
	return [
		address.street,
		address.city,
		address.state,
		address.zipCode,
		address.country,
	]
		.filter(Boolean)
		.join(", ");
}

function createGoldPin() {
	const pin = document.createElement("div");
	pin.style.width = "14px";
	pin.style.height = "14px";
	pin.style.borderRadius = "9999px";
	pin.style.background = "linear-gradient(135deg, #d7b76a, #b8923e)";
	pin.style.boxShadow = "0 10px 24px rgba(215, 183, 106, 0.28)";
	pin.style.border = "1px solid rgba(255,255,255,0.65)";
	pin.style.cursor = "pointer";
	return pin;
}

export default function MapExplore({ properties }) {
	const router = useRouter();
	const mapContainerRef = useRef(null);
	const mapRef = useRef(null);
	const geocoderRef = useRef(null);
	const markersPosRef = useRef(new Map());
	const markersByIdRef = useRef(new Map());
	const geocodeCacheRef = useRef(new Map());

	const listContainerRef = useRef(null);
	const cardRefsRef = useRef(new Map());

	const [activeId, setActiveId] = useState(properties?.[0]?.id || null);
	const [hoveredId, setHoveredId] = useState(null);
	const [mode, setMode] = useState("buy");
	const [query, setQuery] = useState("");
	const [loadingMap, setLoadingMap] = useState(true);
	const [visibleIds, setVisibleIds] = useState(null);

	// Mobile bottom sheet
	const SHEET_COLLAPSED_VH = 12;
	const SHEET_DEFAULT_VH = 46;
	const SHEET_MAX_VH = 82;
	const [sheetVh, setSheetVh] = useState(SHEET_DEFAULT_VH);
	const dragRef = useRef({
		dragging: false,
		startY: 0,
		startVh: SHEET_DEFAULT_VH,
	});
	const isCollapsed = sheetVh <= SHEET_COLLAPSED_VH + 2;

	const baseList = useMemo(() => {
		return (properties || []).map((p) => ({
			id: String(p.id),
			title: p.title,
			price: p.price,
			rentPriceMonthly: p.rentPriceMonthly,
			addressText: formatAddress(p.address),
			imageUrl: p.photos?.[0] || null,
		}));
	}, [properties]);

	const filteredList = useMemo(() => {
		const q = String(query || "")
			.trim()
			.toLowerCase();
		return baseList.filter((p) => {
			if (mode === "rent" && typeof p.rentPriceMonthly !== "number")
				return false;
			if (!q) return true;
			return (
				String(p.title || "")
					.toLowerCase()
					.includes(q) ||
				String(p.addressText || "")
					.toLowerCase()
					.includes(q)
			);
		});
	}, [baseList, mode, query]);

	useEffect(() => {
		if (!filteredList.length) {
			setActiveId(null);
			return;
		}
		setActiveId((prev) => {
			if (prev && filteredList.some((p) => p.id === prev)) return prev;
			return filteredList[0].id;
		});
	}, [filteredList]);

	useEffect(() => {
		if (!mapContainerRef.current) return;
		let cancelled = false;

		const init = async () => {
			try {
				const loader = getGoogleMapsLoader();
				if (!loader) {
					setLoadingMap(false);
					return;
				}
				const { Map } = await loader.importLibrary("maps");
				const { Geocoder } = await loader.importLibrary("geocoding");
				const { AdvancedMarkerElement } = await loader.importLibrary("marker");
				if (cancelled) return;

				if (!geocoderRef.current) geocoderRef.current = new Geocoder();

				if (!mapRef.current) {
					mapRef.current = new Map(mapContainerRef.current, {
						center: { lat: 48.8566, lng: 2.3522 },
						zoom: 12,
						minZoom: 4,
						...(process.env.NEXT_PUBLIC_GOOGLE_MAP_ID
							? { mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID }
							: {}),
						styles: MAP_STYLE_PREMIUM_MUTED,
						disableDefaultUI: true,
						zoomControl: true,
						gestureHandling: "greedy",
					});
					setLoadingMap(false);
				}

				const geocode = (address) => {
					const cached = geocodeCacheRef.current.get(address);
					if (cached) return Promise.resolve(cached);
					return new Promise((resolve, reject) => {
						geocoderRef.current.geocode({ address }, (results, status) => {
							if (status === "OK") {
								const loc = results[0].geometry.location;
								geocodeCacheRef.current.set(address, loc);
								resolve(loc);
							} else {
								reject(status);
							}
						});
					});
				};

				for (const p of baseList) {
					if (!p.addressText) continue;
					if (markersByIdRef.current.has(p.id)) continue;
					try {
						const position = await geocode(p.addressText);
						if (cancelled) return;
						const marker = new AdvancedMarkerElement({
							map: mapRef.current,
							position,
							content: createGoldPin(),
						});
						markersPosRef.current.set(p.id, position);
						markersByIdRef.current.set(p.id, marker);

						if (marker.content) {
							marker.content.addEventListener("mouseenter", () => {
								setHoveredId(p.id);
							});
							marker.content.addEventListener("mouseleave", () => {
								setHoveredId((prev) => (prev === p.id ? null : prev));
							});
						}

						marker.addListener("gmp-click", () => {
							setActiveId(p.id);
							mapRef.current.panTo(position);
							mapRef.current.setZoom(15);
							const el = cardRefsRef.current.get(p.id);
							if (el)
								el.scrollIntoView({ behavior: "smooth", block: "nearest" });
						});
					} catch {
						// ignore geocode failures
					}
				}
			} catch (err) {
				console.error("Google Maps init error:", err);
				setLoadingMap(false);
			}
		};

		init();
		return () => {
			cancelled = true;
		};
	}, [baseList]);

	useEffect(() => {
		if (!mapRef.current) return;
		const ids =
			visibleIds && visibleIds.size
				? visibleIds
				: new Set(filteredList.map((p) => p.id));

		for (const [id, marker] of markersByIdRef.current.entries()) {
			marker.map = ids.has(id) ? mapRef.current : null;
			if (marker.content && marker.content.style) {
				const isHot = id === activeId || id === hoveredId;
				marker.content.style.width = isHot ? "20px" : "14px";
				marker.content.style.height = isHot ? "20px" : "14px";
				marker.content.style.boxShadow = isHot
					? "0 18px 38px rgba(215, 183, 106, 0.55)"
					: "0 10px 24px rgba(215, 183, 106, 0.28)";
				marker.content.style.transform = isHot ? "scale(1.05)" : "scale(1)";
				marker.content.style.transition =
					"transform 180ms ease, width 180ms ease, height 180ms ease, box-shadow 180ms ease";
			}
		}
	}, [activeId, hoveredId, filteredList, visibleIds]);

	useEffect(() => {
		const root = listContainerRef.current;
		if (!root) return;

		const observer = new IntersectionObserver(
			(entries) => {
				setVisibleIds((prev) => {
					const next = prev ? new Set(prev) : new Set();
					for (const entry of entries) {
						const id = entry.target?.dataset?.pid;
						if (!id) continue;
						if (entry.isIntersecting) next.add(id);
						else next.delete(id);
					}
					return next;
				});
			},
			{ root, threshold: 0.55 },
		);

		const els = root.querySelectorAll("[data-pid]");
		els.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [filteredList.length]);

	const focus = (id) => {
		setActiveId(id);
		const pos = markersPosRef.current.get(id);
		if (pos && mapRef.current) {
			mapRef.current.panTo(pos);
			mapRef.current.setZoom(16);
		}
	};

	const onSheetPointerDown = (e) => {
		dragRef.current.dragging = true;
		dragRef.current.startY = e.clientY;
		dragRef.current.startVh = sheetVh;
		e.currentTarget.setPointerCapture?.(e.pointerId);
	};
	const onSheetPointerMove = (e) => {
		if (!dragRef.current.dragging) return;
		const dy = e.clientY - dragRef.current.startY;
		const deltaVh = (dy / window.innerHeight) * 100;
		const next = Math.max(
			SHEET_COLLAPSED_VH,
			Math.min(SHEET_MAX_VH, dragRef.current.startVh - deltaVh),
		);
		setSheetVh(next);
	};
	const onSheetPointerUp = () => {
		if (!dragRef.current.dragging) return;
		dragRef.current.dragging = false;
		const snapPoints = [SHEET_COLLAPSED_VH, 28, SHEET_DEFAULT_VH, 78];
		let best = snapPoints[0];
		let bestDist = Math.abs(sheetVh - best);
		for (const p of snapPoints) {
			const d = Math.abs(sheetVh - p);
			if (d < bestDist) {
				best = p;
				bestDist = d;
			}
		}
		setSheetVh(best);
	};

	const toggleCollapsed = () => {
		setSheetVh((vh) =>
			vh <= SHEET_COLLAPSED_VH + 2 ? SHEET_DEFAULT_VH : SHEET_COLLAPSED_VH,
		);
	};

	return (
		<div className='fixed inset-0'>
			<div className='absolute inset-0'>
				<div ref={mapContainerRef} className='h-full w-full' />
			</div>

			{/* Assombrissement léger pour intégrer la map au design */}
			<div className='absolute inset-0 pointer-events-none bg-gradient-to-b from-black/35 via-black/10 to-black/35' />
			<div className='absolute inset-0 pointer-events-none bg-[#0B1220]/10 mix-blend-multiply' />

			{loadingMap ? (
				<div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
					<div className='glass rounded-2xl px-5 py-3 text-sm text-white/80'>
						Chargement de la carte…
					</div>
				</div>
			) : null}

			<aside
				className='absolute left-4 right-4 bottom-4 md:left-10 md:right-auto md:top-8 md:bottom-8 md:w-[520px] md:max-w-[520px] max-w-[92vw] h-[calc(var(--sheet-vh)*1vh)] md:h-auto'
				style={{ "--sheet-vh": sheetVh }}>
				<div className='h-full rounded-3xl border border-white/10 bg-[#0B1220]/75 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)] overflow-hidden'>
					{/* Drag handle (mobile) */}
					<div
						className='md:hidden px-4 pt-3 pb-2'
						onPointerDown={onSheetPointerDown}
						onPointerMove={onSheetPointerMove}
						onPointerUp={onSheetPointerUp}
						onPointerCancel={onSheetPointerUp}>
						<div className='mx-auto h-1.5 w-12 rounded-full bg-white/20' />
					</div>

					{/* Header */}
					<div className='px-4 pt-3 pb-3 border-b border-white/10'>
						<div className='flex items-center justify-between gap-3'>
							<div className='flex items-center gap-2'>
								<button
									type='button'
									onClick={() => router.back()}
									className='h-9 w-9 rounded-xl border border-white/15 bg-white/10 text-white/90 hover:bg-white/15 transition-colors inline-flex items-center justify-center'
									aria-label='Retour'>
									<FiArrowLeft />
								</button>
								<Link
									href='/'
									className='h-9 px-3 rounded-xl border border-white/15 bg-white/10 text-white/90 hover:bg-white/15 transition-colors inline-flex items-center justify-center gap-2 font-semibold'
									aria-label='Accueil'>
									<FiHome />
									<span className='hidden md:inline'>Accueil</span>
								</Link>
							</div>

							<div className='text-sm font-semibold text-white/90'>
								Explorer
							</div>

							<div className='flex items-center gap-2'>
								<div className='hidden sm:block text-xs text-white/60'>
									{filteredList.length} résultat(s)
								</div>
								<button
									type='button'
									onClick={toggleCollapsed}
									className='md:hidden h-9 w-9 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition-colors inline-flex items-center justify-center'
									aria-label={
										isCollapsed ? "Déplier le panneau" : "Replier le panneau"
									}>
									{isCollapsed ? <FiChevronUp /> : <FiChevronDown />}
								</button>
							</div>
						</div>

						{isCollapsed ? null : (
							<div className='mt-3 flex items-center gap-2'>
								<div className='inline-flex rounded-full border border-white/15 bg-white/10 p-1'>
									<button
										type='button'
										onClick={() => setMode("buy")}
										className={
											"h-9 px-4 rounded-full text-sm font-semibold transition " +
											(mode === "buy"
												? "bg-white/95 text-black shadow-sm"
												: "text-white/70 hover:text-white")
										}>
										Acheter
									</button>
									<button
										type='button'
										onClick={() => setMode("rent")}
										className={
											"h-9 px-4 rounded-full text-sm font-semibold transition " +
											(mode === "rent"
												? "bg-white/95 text-black shadow-sm"
												: "text-white/70 hover:text-white")
										}>
										Louer
									</button>
								</div>

								<div className='relative flex-1'>
									<FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-white/45' />
									<input
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										placeholder='Rechercher (titre / ville)'
										className='w-full h-10 rounded-xl border border-white/15 bg-white/10 pl-9 pr-3 outline-none text-white placeholder:text-white/40'
									/>
								</div>
							</div>
						)}
					</div>

					{/* List */}
					{isCollapsed ? null : (
						<div
							ref={listContainerRef}
							className='h-[calc(100%-112px)] overflow-auto no-scrollbar px-4 py-3 space-y-3'>
							{filteredList.map((p) => {
								const isRent = mode === "rent";
								const displayPrice = isRent ? p.rentPriceMonthly : p.price;
								const suffix = isRent ? "€ / mois" : "€";
								const isActive = activeId === p.id;
								return (
									<button
										key={p.id}
										data-pid={p.id}
										type='button'
										ref={(el) => {
											if (!el) return;
											cardRefsRef.current.set(p.id, el);
										}}
										onMouseEnter={() => setHoveredId(p.id)}
										onMouseLeave={() =>
											setHoveredId((prev) => (prev === p.id ? null : prev))
										}
										onFocus={() => setHoveredId(p.id)}
										onClick={() => focus(p.id)}
										className={
											"w-full text-left bg-white rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition " +
											"hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(0,0,0,0.22)] focus:outline-none " +
											(isActive
												? "ring-2 ring-[color:var(--accent-gold)]"
												: "hover:ring-2 hover:ring-[color:var(--accent-gold)]/50")
										}>
										<div className='relative h-[128px] w-full overflow-hidden'>
											{p.imageUrl ? (
												<Image
													src={p.imageUrl}
													alt={p.title}
													fill
													sizes='(max-width: 768px) 100vw, 420px'
													className='object-cover'
												/>
											) : (
												<div className='h-full w-full bg-black/10' />
											)}
										</div>
										<div className='p-4'>
											<div className='text-2xl font-extrabold text-black leading-none'>
												{formatPrice(displayPrice)}{" "}
												<span className='text-sm font-semibold text-black/60'>
													{suffix}
												</span>
											</div>
											<div className='mt-2 text-sm font-semibold text-black/80 line-clamp-1'>
												{p.title}
											</div>
											<div className='mt-2 flex items-start gap-2 text-xs text-black/55'>
												<FiMapPin className='mt-0.5 text-[color:var(--accent-gold-2)]' />
												<span className='line-clamp-2'>{p.addressText}</span>
											</div>
											<div className='mt-3'>
												<Link
													href={
														isRent ? `/bien/${p.id}?mode=rent` : `/bien/${p.id}`
													}
													className='btn-gold w-full inline-flex items-center justify-center h-10 text-sm font-semibold shadow-[0_10px_24px_rgba(215,183,106,0.25)]'
													onClick={(e) => e.stopPropagation()}>
													Voir le bien
												</Link>
											</div>
										</div>
									</button>
								);
							})}
							{filteredList.length === 0 ? (
								<div className='px-2 py-6 text-white/70 text-sm'>
									Aucun résultat.
								</div>
							) : null}
						</div>
					)}
				</div>
			</aside>
		</div>
	);
}
