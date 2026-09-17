const API_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
export const accessTokenKey = "univmar.access-token";

type ApiEnvelope<T> = { data: T };
type ApiFailure = { message?: string; fields?: Record<string, string> };

export class RequestError extends Error {
  constructor(message: string, public readonly fields: Record<string, string> = {}) {
    super(message);
    this.name = "RequestError";
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(accessTokenKey);
  const isFormData = init.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const problem = body as ApiFailure;
    throw new RequestError(problem.message ?? "The request could not be completed.", problem.fields);
  }

  return (body as ApiEnvelope<T>).data;
}

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  return (await api<{ url: string }>("/uploads/images", { method: "POST", body })).url;
}
