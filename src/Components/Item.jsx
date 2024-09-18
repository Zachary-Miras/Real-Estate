export default function Item({ title, price, address, imageUrl }) {
	return (
		<div className='text-primary bg-white shadow-xl rounded-[15px] mt-0 mb-8 w-96 h-max flex flex-col items-center cursor-pointer'>
			<div className='w-full h-full flex justify-center items-center rounded-t-[15px] overflow-hidden'>
				<img
					src={imageUrl}
					alt={title}
					className='w-full h-full object-cover'
				/>
			</div>
			<div className='bg-secondary h-max w-full m-0 pb-2 pl-2 mt-3 rounded-b-[15px]'>
				<h2 className='text-xl font-semibold mt-3'>{title}</h2>
				<p className='text-accent mt-4'>{price} €</p>
				<p className='text-sm mt-2'>{address}</p>
			</div>
		</div>
	);
}
