// src/Components/Item.jsx

export function Item({ name, priceInCents, description, reviews, ImagePath }) {
	return (
		<div className='bg-white shadow-md rounded-lg p-4 mb-4'>
			<img
				src={ImagePath}
				alt={name}
				className='w-full h-48 object-cover rounded-t-lg'
			/>
			<h2 className='text-xl font-semibold mt-4'>{name}</h2>
			<p className='text-gray-700 mt-2'>${(priceInCents / 100).toFixed(2)}</p>
			<p className='text-gray-600 mt-2'>{description}</p>
			<div className='mt-4'>
				<h3 className='text-lg font-medium'>Reviews:</h3>
				<ul className='list-disc list-inside'>
					{reviews.map((review, index) => (
						<li key={index} className='text-gray-600'>
							{review}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
