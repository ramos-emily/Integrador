import React from "react";

export function GraficoQnt({ total, max, title }) {
  const percentage = Math.min(Math.round((total / max) * 100), 100);
  const offset = 100 - percentage;

  return (
    <section
      className="flex items-center justify-between bg-white text-[#226D13] !p-4 w-full h-30 rounded shadow-md"
      aria-label={`Gráfico de progresso: ${title}`}
    >
      <div>
        <p className="text-3xl font-bold" aria-label={`Progresso de ${percentage} por cento`}>
          {percentage}%
        </p>
        <p className="text-sm opacity-75">{title}</p>
      </div>

      <svg
        className="w-12 h-12 transform -rotate-90"
        viewBox="0 0 36 36"
        role="img"
        aria-label={`Gráfico circular mostrando ${percentage}% de conclusão`}
      >
        <title>{`Gráfico circular de ${percentage}%`}</title>
        <circle
          className="text-[#226D13] opacity-20"
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          r="16"
          cx="18"
          cy="18"
        />
        <circle
          className="text-[#226D13]"
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
    </section>
  );
}
