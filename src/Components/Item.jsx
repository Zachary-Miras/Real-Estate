export function Item({ name, priceInCents, description, reviews, ImagePath }) {
	return (
		<div className='text-primary bg-white shadow-md rounded-lg mb-8 w-80 h-96 flex flex-col items-center'>
			<div className='w-full h-80 flex justify-center items-center'>
				<img src={ImagePath} alt={name} className='w-48 h-60 object-contain' />
			</div>
			<div className='bg-secondary h-max w-full m-0 pb-2 pl-2 mt-3'>
				<h2 className='text-xl font-semibold mt-3'>{name}</h2>
				<p className='text-accent mt-4'>${(priceInCents / 100).toFixed(2)}</p>
			</div>
		</div>
	);
}
