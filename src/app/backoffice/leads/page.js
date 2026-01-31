import BackofficeLeadStatus from "@/Components/backoffice/leads/BackofficeLeadStatus";
import prisma from "@/services/prismaClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Leads | Backoffice",
	description: "Demandes de contact.",
};

function formatDate(date) {
	try {
		return new Intl.DateTimeFormat("fr-FR", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(date));
	} catch {
		return "—";
	}
}

const STATUS_LABEL = {
	NEW: "Nouveau",
	IN_PROGRESS: "En cours",
	DONE: "Traité",
	SPAM: "Spam",
};

export default async function BackofficeLeadsPage({ searchParams }) {
	const status =
		typeof searchParams?.status === "string" ? searchParams.status : "ALL";

	const where = {};
	if (status && status !== "ALL") where.status = status;

	let leadCount = 0;
	let leads = [];
	try {
		[leadCount, leads] = await Promise.all([
			prisma.lead.count({ where }),
			prisma.lead.findMany({
				where,
				orderBy: { createdAt: "desc" },
				include: { property: { select: { id: true, title: true } } },
			}),
		]);
	} catch (err) {
		console.error("Backoffice leads DB error:", err);
	}

	return (
		<div className='max-w-6xl mx-auto'>
			<div className='flex items-center justify-between gap-4'>
				<div>
					<div className='text-2xl md:text-3xl font-bold text-white'>Leads</div>
					<div className='mt-2 text-white/70'>Demandes de contact reçues.</div>
				</div>
				<Link
					href='/backoffice'
					className='text-sm text-white/70 hover:text-white underline underline-offset-4'>
					Retour dashboard
				</Link>
			</div>

			<div className='mt-6 flex flex-wrap gap-2'>
				{["ALL", "NEW", "IN_PROGRESS", "DONE", "SPAM"].map((s) => {
					const active = s === status;
					const label = s === "ALL" ? "Tous" : STATUS_LABEL[s];
					return (
						<Link
							key={s}
							href={`/backoffice/leads?status=${s}`}
							className={
								"h-9 px-4 rounded-full border inline-flex items-center justify-center text-sm font-semibold transition-colors " +
								(active
									? "bg-white text-black border-white"
									: "border-white/15 text-white/80 hover:text-white hover:border-white/25")
							}>
							{label}
						</Link>
					);
				})}
			</div>

			<div className='mt-6 glass rounded-3xl overflow-hidden'>
				<div className='px-5 md:px-7 py-4 border-b border-white/10 flex items-center justify-between'>
					<div className='text-white/80 text-sm'>{leadCount} lead(s)</div>
				</div>

				<div className='divide-y divide-white/10'>
					{leads.map((lead) => (
						<div key={lead.id} className='px-5 md:px-7 py-5'>
							<div className='flex flex-col lg:flex-row lg:items-start justify-between gap-4'>
								<div className='min-w-0'>
									<div className='flex items-center gap-3 flex-wrap'>
										<div className='text-white font-semibold text-lg'>
											{lead.subject}
										</div>
										<div className='text-white/60 text-sm'>
											{formatDate(lead.createdAt)}
										</div>
									</div>
									<div className='mt-2 text-white/70 text-sm'>
										{lead.name} • {lead.email}
										{lead.phone ? ` • ${lead.phone}` : ""}
									</div>
									{lead.property?.id ? (
										<div className='mt-2 text-white/70 text-sm'>
											Bien :{" "}
											<Link
												href={`/backoffice/biens/${lead.property.id}/modifier`}
												className='underline underline-offset-4 hover:text-white text-white/80'>
												{lead.property.title}
											</Link>
										</div>
									) : lead.propertyTitle ? (
										<div className='mt-2 text-white/70 text-sm'>
											Bien : {lead.propertyTitle}
										</div>
									) : null}
									{lead.pageUrl ? (
										<div className='mt-2 text-white/60 text-sm break-all'>
											Source : {lead.pageUrl}
										</div>
									) : null}
									<div className='mt-4 text-white/90 whitespace-pre-wrap'>
										{lead.message}
									</div>
								</div>

								<div className='shrink-0'>
									<BackofficeLeadStatus
										leadId={lead.id}
										initialStatus={lead.status}
									/>
								</div>
							</div>
						</div>
					))}

					{leads.length === 0 ? (
						<div className='px-5 md:px-7 py-10 text-white/70'>Aucun lead.</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
