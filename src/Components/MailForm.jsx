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
		<form onSubmit={sendEmail}>
			<div>
				<label>Nom:</label>
				<input
					type='text'
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
			</div>
			<div>
				<label>Email:</label>
				<input
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div>
				<label>Téléphone:</label>
				<input
					type='tel'
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
				/>
			</div>
			<div>
				<label>Sujet:</label>
				<input
					type='text'
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					required
				/>
			</div>
			<div>
				<label>Message:</label>
				<textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					required
				/>
			</div>
			<button type='submit'>Envoyer</button>
		</form>
	);
}
