import Link from "next/link";

import { getApplications } from "@/lib/api";
import type { JobApplication } from "@/types/application";

function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseLocalDate(value: string) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function isSameDay(left: Date, right: Date) {
    return left.getTime() === right.getTime();
}

function isWithinNextWeek(date: Date, today: Date) {
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    return date > today && date <= sevenDaysFromNow;
}

function sortByFollowupDate(applications: JobApplication[]) {
    return [...applications].sort((a, b) => {
        if (!a.followup_date || !b.followup_date) {
            return 0;
        }

        return (
            parseLocalDate(a.followup_date).getTime() -
            parseLocalDate(b.followup_date).getTime()
        );
    });
}

function FollowUpSection({
    title,
    applications,
}: {
    title: string;
    applications: JobApplication[];
}) {
    return (
        <section className="rounded-md border border-zinc-200 bg-white">
            <header className="border-b border-zinc-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
            </header>

            {applications.length === 0 ? (
                <p className="px-4 py-5 text-sm text-zinc-500">Nothing here.</p>
            ) : (
                <div className="divide-y divide-zinc-200">
                    {applications.map((application) => (
                        <Link
                            key={application.id}
                            href={`/applications/${application.id}`}
                            className="block px-4 py-4 hover:bg-zinc-50"
                        >
                            <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="font-medium text-zinc-950">
                                        {application.company}
                                    </p>
                                    <p className="text-sm text-zinc-600">{application.role}</p>
                                </div>

                                <div className="text-sm text-zinc-600 md:text-right">
                                    <p>{application.status}</p>
                                    <p>{application.followup_date ?? "No date"}</p>
                                </div>
                            </div>

                            {application.followup_note ? (
                                <p className="mt-3 text-sm leading-6 text-zinc-600">
                                    {application.followup_note}
                                </p>
                            ) : null}
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}

export default async function FollowUpsPage() {
    const applications = await getApplications();
    const today = startOfDay(new Date());

    const withFollowup = applications.filter(
        (application) => application.followup_date !== null,
    );
    const withoutFollowup = applications.filter(
        (application) => application.followup_date === null,
    );

    const overdue = sortByFollowupDate(
        withFollowup.filter((application) => {
            const followupDate = parseLocalDate(application.followup_date as string);
            return followupDate < today;
        }),
    );

    const dueToday = sortByFollowupDate(
        withFollowup.filter((application) => {
            const followupDate = parseLocalDate(application.followup_date as string);
            return isSameDay(followupDate, today);
        }),
    );

    const upcomingThisWeek = sortByFollowupDate(
        withFollowup.filter((application) => {
            const followupDate = parseLocalDate(application.followup_date as string);
            return isWithinNextWeek(followupDate, today);
        }),
    );

    return (
        <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500">Follow-ups</p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                            Follow-up Command Center
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                            See which applications need attention next.
                        </p>
                    </div>

                    <Link
                        href="/applications"
                        className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
                    >
                        Back to Applications
                    </Link>
                </header>

                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-md border border-zinc-200 bg-white p-4">
                        <p className="text-sm text-zinc-500">Overdue</p>
                        <p className="mt-2 text-2xl font-semibold">{overdue.length}</p>
                    </div>
                    <div className="rounded-md border border-zinc-200 bg-white p-4">
                        <p className="text-sm text-zinc-500">Due Today</p>
                        <p className="mt-2 text-2xl font-semibold">{dueToday.length}</p>
                    </div>
                    <div className="rounded-md border border-zinc-200 bg-white p-4">
                        <p className="text-sm text-zinc-500">This Week</p>
                        <p className="mt-2 text-2xl font-semibold">
                            {upcomingThisWeek.length}
                        </p>
                    </div>
                    <div className="rounded-md border border-zinc-200 bg-white p-4">
                        <p className="text-sm text-zinc-500">No Follow-up</p>
                        <p className="mt-2 text-2xl font-semibold">
                            {withoutFollowup.length}
                        </p>
                    </div>
                </div>

                <div className="grid gap-5">
                    <FollowUpSection title="Overdue" applications={overdue} />
                    <FollowUpSection title="Due Today" applications={dueToday} />
                    <FollowUpSection
                        title="Upcoming This Week"
                        applications={upcomingThisWeek}
                    />
                    <FollowUpSection
                        title="No Follow-up Scheduled"
                        applications={withoutFollowup}
                    />
                </div>
            </div>
        </main>
    );
}