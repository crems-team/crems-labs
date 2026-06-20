import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const WelcomePage: React.FC = () => {
  const categories = [
    {
      icon: "bi-globe2",
      gradientFrom: "#a8d8f0",
      gradientTo: "#7eb8d4",
      iconColor: "#2a7db5",
      label: "Market",
      labelColor: "#2a7db5",
      description: "See the total production and high-producers.",
      btnLabel: "Search Geography",
      btnColor: "#2a7db5",
    },
    {
      icon: "bi-person-fill",
      gradientFrom: "#b8e6c8",
      gradientTo: "#7dcc9a",
      iconColor: "#2a8a4a",
      label: "Agent",
      labelColor: "#2a8a4a",
      description: "Find details of agents’ production and trends.",
      btnLabel: "Search Agent",
      btnColor: "#2a8a4a",
    },
    {
      icon: "bi-people-fill",
      gradientFrom: "#d0c0f0",
      gradientTo: "#b09ae0",
      iconColor: "#6b3dbf",
      label: "Team",
      labelColor: "#6b3dbf",
      description: "Find details of teams’ production and trends.",
      btnLabel: "Search Team",
      btnColor: "#6b3dbf",
    },
    {
      icon: "bi-buildings-fill",
      gradientFrom: "#f5cfa8",
      gradientTo: "#e8a870",
      iconColor: "#c05e1a",
      label: "Office",
      labelColor: "#c05e1a",
      description: "Find details of office production and trends.",
      btnLabel: "Search Office",
      btnColor: "#c05e1a",
    },
  ];

  const questions = [
    {
      icon: "bi-graph-up-arrow",
      iconColor: "#2a7db5",
      bgColor: "#dce8f5",
      text: "Which agents are producing the most transactions?",
    },
    {
      icon: "bi-geo-alt-fill",
      iconColor: "#2a8a4a",
      bgColor: "#dce8f5",
      text: "Is an agent growing or declining?",
    },
    {
      icon: "bi-people-fill",
      iconColor: "#6b3dbf",
      bgColor: "#dce8f5",
      text: "Which teams dominate a territory?",
    },
    {
      icon: "bi-buildings",
      iconColor: "#c05e1a",
      bgColor: "#dce8f5",
      text: "Is an office growing or declining?",
    },
    {
      icon: "bi-bullseye",
      iconColor: "#17748a",
      bgColor: "#dce8f5",
      text: "Does the agent focus on listing or selling?",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e8f0f8", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── HERO HEADER ── */}
      <div style={{ backgroundColor: "#fdfeff", paddingTop: 48, paddingBottom: 40, textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            fontWeight: 900,
            color: "#1a2e5a",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: 16,
            lineHeight: 1.15,
          }}
        >
          CREMS IQ
        </h1>
        <p style={{ color: "#4a5a7a", fontWeight: 500, fontSize: "1rem", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.6 }}>
          Real estate intelligence for mortgage companies, title companies,<br />
          and real estate brands.
        </p>

        {/* ── START HERE label ── */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "#b8cde0", maxWidth: 200, marginRight: 16 }} />
          <span style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "3px", color: "#2a6abf", textTransform: "uppercase" }}>
            Start Here
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: "#b8cde0", maxWidth: 200, marginLeft: 16 }} />
        </div>

        {/* ── 4 Cards ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            padding: "0 20px 20px",
            maxWidth: 980,
            margin: "0 auto",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.label}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "28px 22px 22px",
                width: "clamp(180px, 22%, 220px)",
                minWidth: 170,
                boxShadow: "0 4px 18px rgba(0,0,0,0.10)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                border: "1px solid #e0eaf5",
              }}
            >
              {/* Gradient circle icon */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 35%, ${cat.gradientFrom}, ${cat.gradientTo})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
                }}
              >
                <i className={`bi ${cat.icon}`} style={{ fontSize: "1.9rem", color: cat.iconColor }} />
              </div>

              {/* Category label */}
              <div style={{ fontWeight: 700, fontSize: "1.15rem", color: cat.labelColor, marginBottom: 8 }}>
                {cat.label}
              </div>

              {/* Description */}
              <p style={{ fontWeight: 500,fontSize: "0.82rem", color: "#5a6880", flexGrow: 1, marginBottom: 20, lineHeight: 1.5 }}>
                {cat.description}
              </p>

              {/* CTA Button */}
              <button
                style={{
                  backgroundColor: cat.btnColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: 7,
                  padding: "10px 18px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  width: "100%",
                  letterSpacing: "0.2px",
                }}
              >
                {cat.btnLabel}
                <i className="bi bi-chevron-right" style={{ fontSize: "0.75rem" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUESTIONS SECTION ── */}
      <div style={{ backgroundColor: "#eff4f9", paddingTop: 44, paddingBottom: 48 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 900,
              letterSpacing: "3px",
              color: "#1a2e5a",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Questions CREMS Answers
          </h2>
          {/* Blue accent underline */}
          <div style={{ width: 48, height: 3, backgroundColor: "#2a6abf", borderRadius: 2, margin: "0 auto" }} />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "center",
            padding: "0 24px",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {questions.map((q) => (
            <div
              key={q.text}
              style={{
                background: "#c8d8e8",
                borderRadius: 12,
                padding: "20px 14px 18px",
                width: "clamp(140px, 17%, 165px)",
                minWidth: 130,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "#dce8f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <i className={`bi ${q.icon}`} style={{ fontSize: "1.25rem", color: q.iconColor }} />
              </div>
              <p style={{ fontSize: "0.78rem", color: "#2a3a5a", margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
                {q.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT THE DATA ── */}
      <div style={{ backgroundColor: "#fdfeff", paddingTop: 40, paddingBottom: 48 }}>
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto 28px",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #d0dcea",
              borderRadius: 12,
              padding: "24px 28px",
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            {/* Left */}
            <div style={{ display: "flex", gap: 16, flex: "1 1 300px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "#e8eef8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  border: "2px solid #c0cfe8",
                }}
              >
                <i className="bi bi-shield-fill" style={{ color: "#7a8fad", fontSize: "1.4rem" }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#1a2e5a", marginBottom: 8, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  About The Data
                </div>
                <p style={{ fontWeight: 500, fontSize: "0.8rem", color: "#5a6880", margin: 0, lineHeight: 1.6 }}>
                  CREMS combines MLS transaction data, licensing information, team reporting,
                  and proprietary analytics to help sales organizations identify opportunity and
                  prioritize relationships.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, backgroundColor: "#d8e4f0", alignSelf: "stretch", flexShrink: 0 }} />

            {/* Right */}
            <div style={{ display: "flex", gap: 16, flex: "1 1 220px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "#e8eef8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  border: "2px solid #c0cfe8",
                }}
              >
                <i className="bi bi-clock-fill" style={{ color: "#2a6abf", fontSize: "1.3rem" }} />
              </div>
              <p style={{fontWeight: 500, fontSize: "0.8rem", color: "#5a6880", margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: "#1a2e5a" }}>Data updated regularly</strong><br />
                CREMS acquires data from multiple MLS, industry source and report, plus originally developed metrics. It is updated daily and has been tracked over several years.
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.82rem", color: "#4a5a7a", marginBottom: 6, fontWeight: 600 }}>
            <i className="bi bi-lock-fill me-1" style={{ color: "#6a7a9a" }} />
            Trusted. Accurate. Comprehensive.
          </p>
          <a
            href="#"
            style={{ fontSize: "0.82rem", color: "#2a6abf", textDecoration: "none", fontWeight: 600 }}
          >
            Learn more about how CREMS works &nbsp;→
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;