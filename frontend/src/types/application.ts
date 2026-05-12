export type ApplicationStatus =
    | "Applied"
    | "Interviewing"
    | "Offered"
    | "Rejected"
    | "Withdrawn";

export type JobApplication = {
    id: number;
    company: string;
    role: string;
    url: string | null;
    status: ApplicationStatus;
    date_applied: string;
    followup_date: string | null;
    followup_note: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
};

export type JobApplicationCreate = {
    company: string;
    role: string;
    url?: string | null;
    status: ApplicationStatus;
    date_applied: string;
    followup_date?: string | null;
    followup_note?: string | null;
    notes?: string | null;
};

export type JobApplicationUpdate = Partial<JobApplicationCreate>;