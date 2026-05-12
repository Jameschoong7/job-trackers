"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { createApplication } from "@/lib/api";
import type { ApplicationStatus, JobApplicationCreate } from "@/types/application";
import Link from "next/link";

const statuses: ApplicationStatus[] = [
    "Applied",
    "Interviewing",
    "Offered",
    "Rejected",
    "Withdrawn",
];

export default function NewApplicationPage() {
    const router = useRouter();
    const [form, setForm] = useState<JobApplicationCreate>({
        company: "",
        role: "",
        url: "",
        status: "Applied",
        date_applied: new Date().toISOString().slice(0,10),
        followup_date: null,
        followup_note: "",
        notes: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function updateField<K extends keyof JobApplicationCreate>(
        field: K,
        value: JobApplicationCreate[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            await createApplication({
                ...form,
                url: form.url || null,
                followup_date: form.followup_date || null,
                followup_note: form.followup_note || null,
                notes: form.notes || null,
            });
            router.push("/applications");
            router.refresh();
        } catch {
            setError("Could not create application. Check that the backend is running.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950">
        <div className="mx-auto max-w-3xl">
          <header className="border-b border-zinc-200 pb-6">
            <Link href="/applications" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">Applications</Link>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Add Application
            </h1>
          </header>

          <form
            onSubmit={handleSubmit}
            className="mt-8 grid gap-5 rounded-md border border-zinc-200 bg-white p-6"
          >
            <label className="grid gap-2 text-sm font-medium">
              Company
              <input
                required
                value={form.company}
                onChange={(event) => updateField("company", event.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Role
              <input
                required
                value={form.role}
                onChange={(event) => updateField("role", event.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Application URL
              <input
                value={form.url ?? ""}
                onChange={(event) => updateField("url", event.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value as ApplicationStatus)
                  }
                  className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Date Applied
                <input
                  required
                  type="date"
                  value={form.date_applied}
                  onChange={(event) =>
                    updateField("date_applied", event.target.value)
                  }
                  className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              Follow-up Date
              <input
                type="date"
                value={form.followup_date ?? ""}
                onChange={(event) =>
                  updateField("followup_date", event.target.value || null)
                }
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Follow-up Note
              <textarea
                value={form.followup_note ?? ""}
                onChange={(event) =>
                  updateField("followup_note", event.target.value)
                }
                className="min-h-24 rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Notes
              <textarea
                value={form.notes ?? ""}
                onChange={(event) => updateField("notes", event.target.value)}
                className="min-h-24 rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save Application"}
            </button>
          </form>
        </div>
      </main>
    )
}