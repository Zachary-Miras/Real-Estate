import Link from "next/link";
export function Header() {
	return (
		<div className='w-full mx-0 p-4 flex flex-row justify-between items-stretch mb-10 border-b border-secondary'>
			<div className='text-2xl font-bold mr-4 cursor-pointer'>Real Estate</div>
			<Link className='cursor-pointer p-2 mr-6' href='/property'>
				{" "}
				Property
			</Link>
			<Link className='cursor-pointer  p-2' href='/cart'>
				RENT
			</Link>
			<Link className='cursor-pointer p-2' href='/cart'>
				SELL
			</Link>
		</div>
	);
}
