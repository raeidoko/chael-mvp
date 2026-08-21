"use client";

export function ProgressChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const width = 600;
  const height = 180;
  const padding = 16;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="progress-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-strong)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent-strong)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#progress-fill)" />
        <path d={linePath} fill="none" stroke="var(--accent-strong)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 4 : 0} fill="var(--accent-strong)" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-text-secondary">
        <span>{data[0].label}</span>
        <span>{data[Math.floor(data.length / 2)].label}</span>
        <span>{data[data.length - 1].label}</span>
      </div>
    </div>
  );
}
