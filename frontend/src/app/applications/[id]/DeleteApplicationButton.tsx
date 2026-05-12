"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteApplication } from "@/lib/api";

type DeleteApplicationButtonProps = {
    applicationId: number;
};

export function DeleteApplicationButton({
    applicationId,
}: DeleteApplicationButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDelete() {
        const confirmed = window.confirm(
            "Delete this application? This cannot be undone.",
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            await deleteApplication(applicationId);
            router.push("/applications");
            router.refresh();
        } catch {
            setError("Could not delete application. Check that the backend is running.");
            setIsDeleting(false);
        }
    }

    return (
        <div className="grid gap-2">
            <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-fit rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isDeleting ? "Deleting..." : "Delete Application"}
            </button>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
    )
}