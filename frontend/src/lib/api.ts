import type {
    ApplicationStatus,
    JobApplication,
    JobApplicationCreate,
    JobApplicationUpdate,
} from "@/types/application";


const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`,{
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    
    if (!response.ok){
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

export function getApplications(
    status?: ApplicationStatus,
): Promise<JobApplication[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";

    return request<JobApplication[]>(`/applications${query}`);
}

export function getApplication(id: number): Promise<JobApplication> {
    return request<JobApplication>(`/applications/${id}`);
}

export function createApplication(
    payload: JobApplicationCreate,
): Promise<JobApplication> {
    return request<JobApplication>("/applications",{
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateApplication(
    id: number,
    payload: JobApplicationUpdate,
): Promise<JobApplication> {
    return request<JobApplication>(`/applications/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteApplication(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "DELETE", 
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
}