import React from "react";

export function GraficoQnt({ total, max, title }) {
  const percentage = Math.min(Math.round((total / max) * 100), 100);
  const offset = 100 - percentage;

  return (
    <div className="flex items-center justify-between bg-white text-[#3473BA] !p-4 w-full h-30 rounded shadow-md">
      <div>
        <div className="text-3xl font-bold">{percentage}%</div>
        <div className="text-sm opacity-75">{title}</div>
      </div>
      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
        <circle
          className="text-[#3473BA] opacity-20"
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          r="16"
          cx="18"
          cy="18"
        />
        <circle
          className="text-[#3473BA]"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="100"
          strokeDashoffset={offset}
          fill="transparent"
          r="16"
          cx="18"
          cy="18"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
    </div>
  );
}
