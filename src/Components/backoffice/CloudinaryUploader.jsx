"use client";

import { useRef, useState } from "react";

export default function CloudinaryUploader({ photos = [], onChange }) {
	const inputRef = useRef(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");

	async function uploadFiles(files) {
		setError("");
		setUploading(true);
		const newUrls = [];

		try {
			for (const file of files) {
				const formData = new FormData();
				formData.append("file", file);

				const res = await fetch("/api/backoffice/upload", {
					method: "POST",
					body: formData,
				});

				const data = await res.json().catch(() => ({}));
				if (!res.ok) {
					setError(data?.error || "Erreur lors de l'upload.");
					break;
				}
				newUrls.push(data.url);
			}

			if (newUrls.length > 0) {
				onChange([...photos, ...newUrls]);
			}
		} catch {
			setError("Erreur réseau lors de l'upload.");
		} finally {
			setUploading(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	}

	function onFileChange(e) {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;
		uploadFiles(files);
	}

	function removePhoto(index) {
		const next = photos.filter((_, i) => i !== index);
		onChange(next);
	}

	return (
		<div>
			<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
				Photos
			</div>

			{/* Grille de preview */}
			{photos.length > 0 ? (
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4'>
					{photos.map((url, i) => (
						<div
							key={`${url}-${i}`}
							className='relative group rounded-xl overflow-hidden border border-white/15 bg-white/5 aspect-[4/3]'>
							<img
								src={url}
								alt={`Photo ${i + 1}`}
								className='w-full h-full object-cover'
							/>
							<button
								type='button'
								onClick={() => removePhoto(i)}
								className='absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600'>
								✕
							</button>
						</div>
					))}
				</div>
			) : null}

			{/* Zone d'upload */}
			<div
				onClick={() => !uploading && inputRef.current?.click()}
				className={
					"border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer transition hover:border-white/40 hover:bg-white/5 " +
					(uploading ? "opacity-60 pointer-events-none" : "")
				}>
				<input
					ref={inputRef}
					type='file'
					accept='image/*'
					multiple
					onChange={onFileChange}
					className='hidden'
				/>
				{uploading ? (
					<div className='text-white/70 text-sm'>
						<span className='inline-block animate-spin mr-2'>⏳</span>
						Upload en cours…
					</div>
				) : (
					<div>
						<div className='text-white/80 text-sm font-medium'>
							Cliquer pour ajouter des images
						</div>
						<div className='text-white/50 text-xs mt-1'>
							JPG, PNG, WebP — plusieurs fichiers autorisés
						</div>
					</div>
				)}
			</div>

			{error ? (
				<div className='mt-2 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2'>
					{error}
				</div>
			) : null}
		</div>
	);
}
