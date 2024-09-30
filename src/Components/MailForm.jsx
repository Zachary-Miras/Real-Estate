import emailjs from "@emailjs/browser";
import { useState } from "react";

export default function MailForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");

	const sendEmail = (e) => {
		e.preventDefault();

		const templateParams = {
			from_name: name,
			from_email: email,
			phone: phone,
			subject: subject,
			message: message,
		};

		emailjs
			.send(
				process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
				process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
				templateParams,
				process.env.NEXT_PUBLIC_EMAILJS_USER_ID
			)
			.then(
				(response) => {
					console.log("SUCCESS!", response.status, response.text);
				},
				(err) => {
					console.log("FAILED...", err);
				}
			);
	};

	return (
		<form
			onSubmit={sendEmail}
			className='text-background flex flex-col text-2xl gap-3 outline-none ml-4 mt-4'>
			<div>Une Question ? Contactez nous :</div>
			<div>
				<label className='flex flex-row'>Nom:</label>
				<input
					type='text'
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					className='text-text outline-none rounded-lg pl-2 w-[50vw] min-w-96 max-w-[500px] h-9 text-lg'
					placeholder='John Doe'
				/>
			</div>
			<div>
				<label className='flex flex-row'>Email:</label>
				<input
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className='text-text outline-none rounded-lg pl-2 w-[50vw] min-w-96 max-w-[500px] h-9 text-lg'
					placeholder='example@gmail.com'
				/>
			</div>
			<div>
				<label className='flex flex-row'>Téléphone:</label>
				<input
					type='tel'
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					className='text-text outline-none rounded-lg pl-2 w-[50vw] min-w-96 max-w-[500px] h-9 text-lg'
					placeholder='+33 6 00 00 00 00'
				/>
			</div>
			<div>
				<label className='flex flex-row'>Sujet:</label>
				<input
					type='text'
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					required
					className='text-text outline-none rounded-lg pl-2 w-[50vw] min-w-96 max-w-[500px] h-9 text-lg'
					placeholder='Sujet de votre message'
				/>
			</div>
			<div>
				<label className='flex flex-row'>Message:</label>
				<textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					required
					className='text-text outline-none rounded-lg pl-2 w-[50vw] min-w-96 max-w-[700px] text-lg'
				/>
			</div>
			<button type='submit' className='border-solid border-2 p-2 rounded-lg'>
				Envoyer
			</button>
		</form>
	);
}
