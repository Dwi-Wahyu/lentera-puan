import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  let session;
  
  if (typeof window === "undefined") {
    // Server-side
    session = await getServerSession(authOptions);
  } else {
    // Client-side
    session = await getSession();
  }
  
  const headers: Record<string, string> = {
    ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || errorData.message || `API Error: ${response.status} ${response.statusText}`;
      throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }

    return response.json();
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message === 'fetch failed') {
      throw new Error("Gagal menghubungkan ke server backend. Pastikan server backend sedang berjalan.");
    }
    throw error;
  }
}

export const api = {
  // Auth
  me: () => fetchWithAuth("/auth/me"),

  // Users
  getUsers: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/users${query ? `?${query}` : ""}`);
  },
  getUser: (id: string) => fetchWithAuth(`/users/${id}`),
  createUser: (data: any) => fetchWithAuth("/users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id: string, data: any) => fetchWithAuth(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteUser: (id: string) => fetchWithAuth(`/users/${id}`, { method: "DELETE" }),

  // Patients
  getPatients: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/patients${query ? `?${query}` : ""}`);
  },
  getPatient: (id: string) => fetchWithAuth(`/patients/${id}`),
  createPatient: (data: any) => fetchWithAuth("/patients", { method: "POST", body: JSON.stringify(data) }),
  updatePatient: (id: string, data: any) => fetchWithAuth(`/patients/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deletePatient: (id: string) => fetchWithAuth(`/patients/${id}`, { method: "DELETE" }),

  // Checkups
  getCheckupsByPatient: (patientId: string) => fetchWithAuth(`/checkups/patient/${patientId}`),
  getCheckup: (id: string) => fetchWithAuth(`/checkups/${id}`),
  createCheckup: (data: any) => fetchWithAuth("/checkups", { method: "POST", body: JSON.stringify(data) }),
  updateCheckup: (id: string, data: any) => fetchWithAuth(`/checkups/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCheckup: (id: string) => fetchWithAuth(`/checkups/${id}`, { method: "DELETE" }),

  // Crisis
  getCrisisReports: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/crisis${query ? `?${query}` : ""}`);
  },
  getCrisisReport: (id: string) => fetchWithAuth(`/crisis/${id}`),
  createCrisisReport: (data: any) => fetchWithAuth("/crisis", { method: "POST", body: JSON.stringify(data) }),
  updateCrisisReport: (id: string, data: any) => fetchWithAuth(`/crisis/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCrisisReport: (id: string) => fetchWithAuth(`/crisis/${id}`, { method: "DELETE" }),
  addCrisisLog: (id: string, data: any) => fetchWithAuth(`/crisis/${id}/logs`, { method: "POST", body: JSON.stringify(data) }),
  uploadEvidence: (id: string, formData: FormData) => fetchWithAuth(`/crisis/${id}/evidence`, { 
    method: "POST", 
    body: formData,
    headers: {} // Let fetch set boundary
  }),

  // Safehouses
  getSafehouses: () => fetchWithAuth("/safehouses"),
  getSafehouse: (id: string) => fetchWithAuth(`/safehouses/${id}`),
  createSafehouse: (data: any) => fetchWithAuth("/safehouses", { method: "POST", body: JSON.stringify(data) }),
  updateSafehouse: (id: string, data: any) => fetchWithAuth(`/safehouses/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteSafehouse: (id: string) => fetchWithAuth(`/safehouses/${id}`, { method: "DELETE" }),

  // Interventions
  getInterventions: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/interventions${query ? `?${query}` : ""}`);
  },
  getIntervention: (id: string) => fetchWithAuth(`/interventions/${id}`),
  createIntervention: (data: any) => fetchWithAuth("/interventions", { method: "POST", body: JSON.stringify(data) }),
  updateIntervention: (id: string, data: any) => fetchWithAuth(`/interventions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteIntervention: (id: string) => fetchWithAuth(`/interventions/${id}`, { method: "DELETE" }),

  // System
  getDashboardStats: () => fetchWithAuth("/system/stats"),
  getConfig: () => fetchWithAuth("/system/config"),
  updateConfig: (data: any) => fetchWithAuth("/system/config", { method: "PATCH", body: JSON.stringify(data) }),
  getAuditLogs: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/system/audit-logs${query ? `?${query}` : ""}`);
  },
};
