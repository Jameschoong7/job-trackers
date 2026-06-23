import Link from "next/link";

import { getApplications } from "@/lib/api";
import type { ApplicationStatus, JobApplication } from "@/types/application";

const statuses: ApplicationStatus[] = [
    "Applied",
    "Interviewing",
    "Offered",
    "Rejected",
    "Withdrawn",
];

function groupByStatus(applications: JobApplication[]) {
    return statuses.map((status) => ({
        status,
        applications: applications.filter(
            (application) => application.status === status,
        ),
    }));
}

export default async function ApplicationsBoardPage() {
    const applications = await getApplications();
    const columns = groupByStatus(applications);

    return (
        <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500">Applications</p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                            Application Board
                        </h1>
                        
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/applications"
                            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
                        >
                            List View
                        </Link>
                        <Link
                            href="/applications/new"
                            className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                        >
                            Add Application
                        </Link>
                    </div>
                </header>

                <section className="grid gap-4 lg:grid-cols-5">
                    {columns.map((column) => (
                        <div
                            key={column.status}
                            className="rounded-md border border-zinc-200 bg-white"
                        >
                            <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
                                <h2 className="text-sm font-semibold">{column.status}</h2>
                                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                                    {column.applications.length}
                                </span>
                            </header>

                            <div className="grid gap-3 p-3">
                                {column.applications.length === 0 ? (
                                    <p className="rounded-md border border-dashed border-zinc-200 p-4 text-sm text-zinc-500">
                                        No applications.
                                    </p>
                                ) : (
                                    column.applications.map((application) => (
                                        <Link
                                            key={application.id}
                                            href={`/applications/${application.id}`}
                                            className="rounded-md border border-zinc-200 p-4 text-sm hover:border-zinc-300 hover:bg-zinc-50"
                                        >
                                            <p className="font-medium text-zinc-950">
                                                {application.company}
                                            </p>
                                            <p className="mt-1 text-zinc-600">{application.role}</p>

                                            {application.followup_date ? (
                                                <p className="mt-3 text-xs font-medium text-zinc-500">
                                                    Follow up: {application.followup_date}
                                                </p>
                                            ) : null}
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}