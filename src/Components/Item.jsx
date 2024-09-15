export function Item({ name, priceInCents, description, reviews, ImagePath }) {
	return (
		<div className='text-primary shadow-md rounded-lg mb-8 w-80 h-96'>
			<img
				src={ImagePath}
				alt={name}
				className='w-full h-80 object-scale-down rounded-t-lg'
			/>
			<div className='bg-secondary h-max w-full m-0 pb-2'>
				<h2 className='text-xl font-semibold mt-4'>{name}</h2>
				<p className='text-accent mt-2'>${(priceInCents / 100).toFixed(2)}</p>
			</div>
		</div>
	);
}
