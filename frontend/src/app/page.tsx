const summaryItems = [
  { label: "Applied", value: 0 },
  { label: "Interviewing", value: 0 },
  { label: "Offered", value: 0 },
  { label: "Rejected", value: 0 },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Job Tracker
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Track applications, follow-ups, and outcomes from one focused
              workspace.
            </p>
          </div>

          <nav className="flex gap-3">
            <a
              href="/applications"
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            >
              Applications
            </a>
            <a
              href="/applications/new"
              className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Add Application
            </a>
          </nav>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
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

        <section className="rounded-md border border-dashed border-zinc-300 bg-white p-8">
          <h2 className="text-lg font-medium">No applications yet</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
            The tracker will show saved job applications here after the frontend
            is connected to the backend API.
          </p>
        </section>
      </div>
    </main>
  );
}