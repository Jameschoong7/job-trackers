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

          <Link
            href="/applications/new"
            className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Add Application
          </Link>
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
        <nav className="flex flex-wrap gap-2">
          <Link
            href="/applications"
            className={`rounded-md border px-3 py-2 text-sm font-medium ${
              selectedStatus === undefined
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
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                selectedStatus === status
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
                : "Add your first demo application once the create form is ready."}
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
                <span>{application.date_applied}</span>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}