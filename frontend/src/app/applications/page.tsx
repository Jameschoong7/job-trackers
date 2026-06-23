import Link from "next/link";

import { getApplications } from "@/lib/api";
import type { ApplicationStatus } from "@/types/application";

const statuses: ApplicationStatus[] = [
  "Applied",
  "Interviewing",
  "Offered",
  "Rejected",
  "Withdrawn",
];

function getDaysSince(dateValue: string) {
  const startDate = new Date(dateValue);
  const today = new Date();

  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor(
    (today.getTime() - startDate.getTime()) / millisecondsPerDay,
  );
}


type ApplicationsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

function isApplicationStatus(value: string | undefined): value is ApplicationStatus {
  return statuses.includes(value as ApplicationStatus);
}

export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const { status } = await searchParams;
  const selectedStatus = isApplicationStatus(status) ? status : undefined;
  const applications = await getApplications(selectedStatus);
  const allApplications = selectedStatus
    ? await getApplications()
    : applications;

  const summaryItems = statuses.map((status) => ({
    label: status,
    value: allApplications.filter((application) => application.status === status)
      .length,
  }));
  const activeApplications = allApplications.filter((application) =>
    ["Applied", "Interviewing"].includes(application.status),
  );

  const interviewCount = allApplications.filter(
    (application) => application.status === "Interviewing",
  ).length;

  const offerCount = allApplications.filter(
    (application) => application.status === "Offered",
  ).length;

  const interviewRate =
    allApplications.length === 0
      ? 0
      : Math.round((interviewCount / allApplications.length) * 100);

  const offerRate =
    allApplications.length === 0
      ? 0
      : Math.round((offerCount / allApplications.length) * 100);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const followedUpApplications = allApplications.filter(
    (application) => application.followup_date !== null,
  );

  const oldestActiveApplication = activeApplications
    .toSorted(
      (a, b) =>
        new Date(a.date_applied).getTime() - new Date(b.date_applied).getTime(),
    )
    .at(0);

  const recentApplications = allApplications
    .toSorted(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 5);
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Applications</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Job Applications
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/applications/board"
              className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            >
              Board View
            </Link>
            <Link
              href="/follow-ups"
              className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            >
              Follow-ups
            </Link>

            <Link
              href="/applications/new"
              className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Add Application
            </Link>
          </div>
        </header>
        <section className="grid gap-4 md:grid-cols-5">
          <div className="rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">All</p>
            <p className="mt-2 text-2xl font-semibold">{allApplications.length}</p>
          </div>

          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="rounded-md border border-zinc-200 bg-white p-4"
            >
              <p className="text-sm text-zinc-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </section>
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Active Applications</p>
            <p className="mt-2 text-2xl font-semibold">
              {activeApplications.length}
            </p>
          </div>

          <div className="rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Interview Rate</p>
            <p className="mt-2 text-2xl font-semibold">{interviewRate}%</p>
          </div>

          <div className="rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Offer Rate</p>
            <p className="mt-2 text-2xl font-semibold">{offerRate}%</p>
          </div>

          <div className="rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Followed Up</p>
            <p className="mt-2 text-2xl font-semibold">
              {followedUpApplications.length}
            </p>
          </div>
        </section>

        {oldestActiveApplication ? (
          <section className="rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Oldest Active Application</p>
            <Link
              href={`/applications/${oldestActiveApplication.id}`}
              className="mt-2 block font-medium text-zinc-950 underline underline-offset-4"
            >
              {oldestActiveApplication.company} — {oldestActiveApplication.role}
            </Link>
          </section>
        ) : null}
        <section className="rounded-md border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500">Recent Activity</p>
              <h2 className="mt-1 text-lg font-semibold">Recently updated applications</h2>
            </div>
            <Link
              href="/applications/board"
              className="text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-950"
            >
              View board
            </Link>
          </div>

          <div className="mt-4 divide-y divide-zinc-100">
            {recentApplications.map((application) => (
              <Link
                key={application.id}
                href={`/applications/${application.id}`}
                className="grid gap-2 py-3 hover:bg-zinc-50 md:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-medium text-zinc-950">
                    {application.company}
                  </p>
                  <p className="text-sm text-zinc-600">{application.role}</p>
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-600 md:justify-end">
                  <span>{application.status}</span>
                  <span>
                    Updated {new Date(application.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <nav className="flex flex-wrap gap-2">
          <Link
            href="/applications"
            className={`rounded-md border px-3 py-2 text-sm font-medium ${selectedStatus === undefined
              ? "border-zinc-950 bg-zinc-950 text-white"
              : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
              }`}
          >
            All
          </Link>

          {statuses.map((status) => (
            <Link
              key={status}
              href={`/applications?status=${encodeURIComponent(status)}`}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${selectedStatus === status
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
            >
              {status}
            </Link>
          ))}
        </nav>

        {applications.length === 0 ? (
          <section className="rounded-md border border-dashed border-zinc-300 bg-white p-8">
            <h2 className="text-lg font-medium">No applications found</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
              {selectedStatus
                ? `No ${selectedStatus.toLowerCase()} applications yet.`
                : "Add your first application."}
            </p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
            <div className="grid grid-cols-4 border-b border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-500">
              <span>Company</span>
              <span>Role</span>
              <span>Status</span>
              <span>Date Applied</span>
            </div>

            {applications.map((application) => (
              <Link
                key={application.id}
                href={`/applications/${application.id}`}
                className="grid grid-cols-4 px-4 py-3 text-sm hover:bg-zinc-50"
              >
                <span className="font-medium">{application.company}</span>
                <span>{application.role}</span>
                <span>{application.status}</span>
                <span className="text-zinc-500">
                  {application.date_applied} · {getDaysSince(application.date_applied)}{" "}
                  days ago
                </span>

              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}