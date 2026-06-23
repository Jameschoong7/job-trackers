import Link from "next/link";
import { notFound } from "next/navigation";

import { getApplication } from "@/lib/api";
import { DeleteApplicationButton } from "./DeleteApplicationButton";

type ApplicationDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ApplicationDetailPage({
    params,
}: ApplicationDetailPageProps) {
    const { id } = await params;
    const applicationId = Number(id);

    if (Number.isNaN(applicationId)) {
        notFound();
    }


    const application = await getApplication(applicationId).catch(() => null);

    if (!application) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                <header className="border-b border-zinc-200 pb-6">
                    <Link
                        href="/applications"
                        className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
                    >
                        Back to applications
                    </Link>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                        {application.company}
                    </h1>
                    <p className="mt-2 text-zinc-600">{application.role}</p>
                </header>

                <section className="grid gap-4 rounded-md border border-zinc-200 bg-white p-6">
                    <div>
                        <p className="text-sm text-zinc-500">Status</p>
                        <p className="mt-1 font-medium">{application.status}</p>
                    </div>

                    <div>
                        <p className="text-sm text-zinc-500">Date Applied</p>
                        <p className="mt-1 font-medium">{application.date_applied}</p>
                    </div>

                    {application.url ? (
                        <div>
                            <p className="text-sm text-zinc-500">Application URL</p>
                            <a
                                href={application.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1 block font-medium text-zinc-950 underline underline-offset-4"
                            >
                                {application.url}
                            </a>
                        </div>
                    ) : null}

                    <div>
                        <p className="text-sm text-zinc-500">Follow-up Date</p>
                        <p className="mt-1 font-medium">
                            {application.followup_date ?? "No follow-up date set"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-zinc-500">Follow-up Note</p>
                        <p className="mt-1 whitespace-pre-wrap">
                            {application.followup_note ?? "No follow-up note yet"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-zinc-500">Notes</p>
                        <p className="mt-1 whitespace-pre-wrap">
                            {application.notes ?? "No notes yet"}
                        </p>
                    </div>
                </section>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={`/applications/${application.id}/edit`}
                        className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
                    >
                        Edit Application
                    </Link>
                    <Link
                        href="/follow-ups"
                        className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
                    >
                        Follow-ups
                    </Link>
                    <DeleteApplicationButton applicationId={application.id} />
                </div>

            </div>
        </main>
    );

}
