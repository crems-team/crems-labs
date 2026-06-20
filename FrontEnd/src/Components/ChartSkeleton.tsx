import React from "react";

export default function ChartSkeleton({
  height = 340,
  bars = 12
}: { height?: number; bars?: number }) {
  const heights = Array.from({ length: bars }, (_, i) => 30 + ((i * 17) % 60)); // 30–90%

  return (
    <div className="chart-skel" style={{ height }} aria-busy="true" aria-label="Loading chart">
      <div className="chart-skel__plot">
        {heights.map((h, i) => (
          <div key={i} className="chart-skel__bar" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="chart-skel__legend">
        <span className="chart-skel__pill" />
        <span className="chart-skel__pill" />
      </div>
    </div>
  );
}