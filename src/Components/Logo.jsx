export default function Logo({
	size = 40,
	gold = "#C9A24D",
	cream = "#F5F5F5",
	className = "",
	...props
}) {
	return (
		<svg
			width={size}
			height={size}
			viewBox='0 0 100 100'
			role='img'
			aria-label='Real Estate'
			className={className}
			{...props}>
			<circle
				cx='50'
				cy='50'
				r='46'
				fill='none'
				stroke={gold}
				strokeWidth='4'
			/>
			<g
				fill='none'
				stroke={cream}
				strokeWidth='4'
				strokeLinecap='round'
				strokeLinejoin='round'
				opacity='0.95'>
				{/* Skyline minimaliste */}
				<path d='M22 66H78' />
				<path d='M26 66V54H34V66' />
				<path d='M38 66V42H48V66' />
				<path d='M43 42V34' />
				<path d='M52 66V50H60V66' />
				<path d='M64 66V38H74V66' />
				<path d='M64 46H74' />
			</g>

			{/* Accent or discret */}
			<path d='M43 34h0' stroke={gold} strokeWidth='6' strokeLinecap='round' />
		</svg>
	);
}
