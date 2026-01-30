"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
export default function Carousel({ slides, className = "" }) {
	const [currentSlide, setCurrentSlide] = useState(0);

	const previousSlide = useCallback(() => {
		if (!slides?.length) return;
		setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
	}, [slides]);

	const nextSlide = useCallback(() => {
		if (!slides?.length) return;
		setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
	}, [slides]);

	const handleKeyDown = useCallback(
		(event) => {
			if (event.key === "ArrowLeft") {
				previousSlide();
			} else if (event.key === "ArrowRight") {
				nextSlide();
			}
		},
		[previousSlide, nextSlide],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	return (
		<div
			className={`relative w-full overflow-hidden rounded-2xl bg-white/5 aspect-[16/10] ${className}`.trim()}>
			<div
				className='flex h-full w-full transition-transform ease-out duration-300'
				style={{
					transform: `translateX(-${currentSlide * 100}%)`,
				}}>
				{slides.map((photo, index) => (
					<div
						key={photo + index}
						className='relative h-full w-full shrink-0 select-none'>
						<Image
							src={photo}
							alt={`Photo ${index + 1}`}
							fill
							sizes='(max-width: 768px) 100vw, 900px'
							className='object-cover'
							draggable={false}
							priority={index === 0}
						/>
					</div>
				))}
			</div>

			<div className='absolute inset-0 flex items-center justify-between px-4 text-white'>
				<button
					type='button'
					onClick={previousSlide}
					className='h-11 w-11 rounded-full glass grid place-items-center text-2xl hover:bg-white/10 transition'
					aria-label='Photo précédente'>
					<IoIosArrowBack />
				</button>
				<button
					type='button'
					onClick={nextSlide}
					className='h-11 w-11 rounded-full glass grid place-items-center text-2xl hover:bg-white/10 transition'
					aria-label='Photo suivante'>
					<IoIosArrowForward />
				</button>
			</div>

			<div className='absolute bottom-0 left-0 right-0 py-4 flex justify-center items-center gap-2'>
				{slides.map((_, index) => (
					<button
						key={`dot-${index}`}
						type='button'
						onClick={() => setCurrentSlide(index)}
						aria-label={`Aller à la photo ${index + 1}`}
						className={`h-2.5 w-2.5 rounded-full transition-all ${
							index === currentSlide
								? "bg-white"
								: "bg-white/45 hover:bg-white/70"
						}`}
					/>
				))}
			</div>
		</div>
	);
}
