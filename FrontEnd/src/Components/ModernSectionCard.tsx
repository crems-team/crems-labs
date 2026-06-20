// ModernSectionCard.tsx
import React from "react";

export interface ModernSectionCardProps {
  title: string;
  icon?: string;
  info?: string;
  actions?: { label: string; onClick: () => void }[];
  content: React.ReactNode;
}
const ModernSectionCard: React.FC<ModernSectionCardProps> = ({
  title, icon, info, actions, content
}) => (
  <div className="card mb-3 shadow-sm border-0 rounded-3">
    <div className="card-header bg-white d-flex align-items-center gap-2 border-0 rounded-top-3">
      {icon && <i className={`bi bi-${icon} text-info me-2`}></i>}
      <span className="fw-bold">{title}</span>
      {info && (
        <span className="ms-1 badge rounded-pill bg-light text-secondary fs-7"
          data-bs-toggle="popover"
          title="Note"
          data-bs-content={info}
          style={{ cursor: "pointer" }}>
          <i className="bi bi-info-circle"></i>
        </span>
      )}
      {actions && (
        <div className="ms-auto d-flex gap-2">
          {actions.map((action, i) => (
            <button key={i} type="button"
              className="btn btn-outline-info btn-sm fw-bold"
              onClick={action.onClick}>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
    <div className="card-body pb-2">{content}</div>
  </div>
);

export default ModernSectionCard;
