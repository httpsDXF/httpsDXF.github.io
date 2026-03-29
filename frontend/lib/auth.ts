"use client";

const ACCESS = "httpsdxf_access";
const REFRESH = "httpsdxf_refresh";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS, access);
  localStorage.setItem(REFRESH, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
}

export function authHeaders(): HeadersInit {
  const t = getAccessToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
