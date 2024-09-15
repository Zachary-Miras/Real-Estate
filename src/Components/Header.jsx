export function Header() {
	return (
		<div className='w-full mx-0 p-4 flex flex-row justify-between items-stretch mb-10 bg-secondary border-b border-secondary'>
			<div className='text-2xl font-bold mr-4 cursor-pointer'>Shop</div>
			<form className='flex justify-center items-center flex-grow mr-4'>
				<input
					type='text'
					placeholder='Recherche'
					className='border rounded p-2 mr-2 w-full max-w-[70%] grow outline-none'
				/>
				<button type='submit' className='bg-blue-500 text-white rounded p-2'>
					OK
				</button>
			</form>
			<div className='cursor-pointer border border-sky-500 p-2'>Panier</div>
		</div>
	);
}
