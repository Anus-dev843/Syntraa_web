/** Shared types for `/api/admin/diagnostics` — safe to import from client components. */

export type DiagnosticStatus = "good" | "warn" | "bad";

export type DiagnosticCheck = {
  id: string;
  status: DiagnosticStatus;
  title: string;
  detail: string;
};

export type AdminDiagnosticsPayload = {
  overall: DiagnosticStatus;
  overallLabel: string;
  checks: DiagnosticCheck[];
  renderChecklist: string[];
  mongo: {
    configured: boolean;
    connected: boolean;
    productCount: number | null;
    database: string;
  };
  cloudinary: {
    configured: boolean;
    cloudName: string | null;
  };
  generatedAt: string;
};
