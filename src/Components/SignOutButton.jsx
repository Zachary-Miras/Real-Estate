"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton({
	className,
	children = "Se déconnecter",
}) {
	return (
		<button
			type='button'
			className={
				className ||
				"btn-gold px-5 h-10 inline-flex items-center justify-center font-semibold"
			}
			onClick={() => signOut({ callbackUrl: "/" })}>
			{children}
		</button>
	);
}
