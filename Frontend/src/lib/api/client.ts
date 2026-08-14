// Internal API Base URL
// Browser client uses relative path "/api" (proxied internally by Next.js rewrites)
// Server-side calls use the internal backend URL directly
function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return (
    process.env.INTERNAL_BACKEND_URL ||
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
  );
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (
    !headers["Content-Type"] &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
  }

  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      error.title ?? "Request failed",
      error.detail
    );
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return undefined as T;
}
