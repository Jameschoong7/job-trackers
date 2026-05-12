import Link from "next/link";
import { notFound } from "next/navigation";

import { getApplication } from "@/lib/api";
import { EditApplicationForm } from "./EditApplicationForm";

type EditApplicationPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditApplicationPage({
    params,
}: EditApplicationPageProps) {
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
            <div className="mx-auto max-w-3xl">
                <header className="border-b border-zinc-200 pb-6">
                    <Link
                        href={`/applications/${application.id}`}
                        className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
                    >
                        Back to application
                    </Link>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                        Edit Application
                    </h1>
                </header>

                <EditApplicationForm application={application} />
            </div>
        </main>
    );
}