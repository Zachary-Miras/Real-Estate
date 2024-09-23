import { useEffect, useState } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

export default function Carousel({ slides }) {
	const [currentSlide, setCurrentSlide] = useState(0);

	const previousSlide = () => {
		if (currentSlide === 0) {
			setCurrentSlide(slides.length - 1);
		} else {
			setCurrentSlide(currentSlide - 1);
		}
	};

	const nextSlide = () => {
		if (currentSlide === slides.length - 1) {
			setCurrentSlide(0);
		} else {
			setCurrentSlide(currentSlide + 1);
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === "ArrowLeft") {
			previousSlide();
		} else if (event.key === "ArrowRight") {
			nextSlide();
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [currentSlide]);

	return (
		<div className='overflow-hidden relative'>
			<div
				className={`flex transition ease-out duration-300`}
				style={{
					transform: `translateX(-${currentSlide * 100}%)`,
				}}>
				{slides.map((photo, index) => (
					<img key={index} src={photo} />
				))}
			</div>

			<div className='absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl outline-0'>
				<button onClick={previousSlide}>
					<FaArrowCircleLeft />
				</button>
				<button onClick={nextSlide}>
					<FaArrowCircleRight />
				</button>
			</div>

			<div className='absolute bottom-0 py-4 flex justify-center items-center gap-3 w-full'>
				{slides.map((photo, index) => {
					return (
						<div
							onClick={() => setCurrentSlide(index)}
							key={"circle" + index}
							className={`rounded-full w-3 h-3 cursor-pointer hover:bg-gray-200 hover:p-2 duration-300 ${
								index == currentSlide ? "bg-white" : "bg-gray-300"
							}
                            `}></div>
					);
				})}
			</div>
		</div>
	);
}
