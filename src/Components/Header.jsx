export function Header() {
	return (
		<div className='container mx-auto p-4 flex flex-row justify-between items-start mb-10'>
			<div className='text-2xl font-bold mr-4 cursor-pointer'>Shop</div>
			<form className='flex justify-center items-center flex-grow mr-4'>
				<input
					type='text'
					placeholder='Recherche'
					className='border rounded p-2 mr-2 w-full max-w-[70%] outline-none'
				/>
				<button type='submit' className='bg-blue-500 text-white rounded p-2'>
					OK
				</button>
			</form>
			<div className='cursor-pointer border border-sky-500 p-2'>Panier</div>
		</div>
	);
}
