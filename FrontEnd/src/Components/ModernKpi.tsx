// ModernKpi.tsx
import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

export interface ModernKpiProps {
  label: string;
  value: React.ReactNode;
  icon: string;
  loading?: boolean;
}
const ModernKpi: React.FC<ModernKpiProps> = ({
  label, value, icon, loading
}) => (
  <div className="col-6 col-md-3 mb-2">
    <div className="bg-white rounded-3 shadow-sm py-2 px-2 d-flex flex-column align-items-center border">
      <span className="mb-1 text-info fs-5">
        <i className={`bi bi-${icon}`}></i>
      </span>
      <span className="fw-bold fs-5">
        {loading ? <ProgressSpinner style={{ width: "24px", height: "24px" }} strokeWidth="4" /> : value}
      </span>
      <span className="text-muted small">{label}</span>
    </div>
  </div>
);

export default ModernKpi;
