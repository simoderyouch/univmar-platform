export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
export const accessTokenKey = "univmar.access-token";

/** Resolve imported local asset paths after the catalog gallery was moved. */
export function resolveImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  // Imported catalog media is stored in MinIO and streamed by the ERP API.
  // This avoids exposing the private storage endpoint to browsers.
  const localApiUrl = url.replace(/^https?:\/\/[^/]+(?=\/api\/v1\/uploads\/)/i, "");
  const normalized = localApiUrl
    .replace(/^\/base-gallery\//, "/api/v1/uploads/base-gallery/")
    .replace(/^\/images\//, "/api/v1/uploads/base-gallery/");
  const assetBase = (import.meta.env.VITE_ASSET_BASE_URL as string | undefined)?.replace(/\/$/, "");
  return assetBase && normalized.startsWith("/") ? `${assetBase}${normalized}` : normalized;
}

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
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(accessTokenKey);
      window.dispatchEvent(new Event("univmar:authentication-lost"));
    }
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

export type UploadedDocument = { url: string; originalFilename: string; contentType: string; size: number };

export async function uploadDocument(file: File): Promise<UploadedDocument> {
  const body = new FormData();
  body.append("file", file);
  return api<UploadedDocument>("/uploads/documents", { method: "POST", body });
}

export async function downloadProtectedFile(url: string, filename: string): Promise<void> {
  const token = localStorage.getItem(accessTokenKey);
  const apiUrl = new URL(apiBaseUrl, window.location.origin);
  const basePath = apiUrl.pathname.replace(/\/$/, "");
  const documentPrefix = `${basePath}/uploads/documents/`;
  const inquiryAttachmentPrefix = `${basePath}/cms/contact-submissions/`;
  const target = new URL(url, apiUrl);
  const isManagedDocument = target.pathname.startsWith(documentPrefix);
  const isInquiryAttachment = /^\/api\/v1\/cms\/contact-submissions\/[^/]+\/attachments\/[^/]+$/.test(target.pathname) && target.pathname.startsWith(inquiryAttachmentPrefix);
  if (target.origin !== apiUrl.origin || (!isManagedDocument && !isInquiryAttachment)) {
    throw new RequestError("This document does not have a trusted download URL.");
  }
  const response = await fetch(target.toString(), { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!response.ok) throw new RequestError("The file could not be downloaded.");
  const objectUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
