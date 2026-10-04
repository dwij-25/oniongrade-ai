import React from "react";

export function DonutChart({
  gradeAPct,
  ursPct,
  rejectPct,
  a,
  u,
  r,
  size = 160,
  strokeWidth = 18,
  centerLabel,
  centerSub,
  label = "Grade A"
}) {
  // Normalize props for backward compatibility
  const valA = Number(gradeAPct !== undefined ? gradeAPct : a) || 0;
  const valU = Number(ursPct !== undefined ? ursPct : u) || 0;
  const valR = Number(rejectPct !== undefined ? rejectPct : r) || 0;

  const total = (valA + valU + valR) || 100;
  const pctA = Math.round((valA / total) * 100);
  const pctU = Math.round((valU / total) * 100);
  const pctR = Math.max(0, 100 - pctA - pctU);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { value: pctA, color: "#F18B49", name: "Grade A" },
    { value: pctU, color: "#EB87A9", name: "URS" },
    { value: pctR, color: "#5F1C47", name: "Reject" }
  ];

  let accumulatedDash = 0;

  return (
    <div
      className="relative shrink-0 mx-auto flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="-rotate-90 w-full h-full transform"
      >
        {/* Background track circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Dynamic colored segments */}
        {segments.map((seg, i) => {
          const dash = (seg.value / 100) * circumference;
          const strokeDashoffset = -accumulatedDash;
          accumulatedDash += dash;

          if (seg.value <= 0) return null;

          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          );
        })}
      </svg>

      {/* Center Label & Subtitle */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <strong className="font-mono font-black text-xl sm:text-2xl text-[#F8D5C2] leading-none font-tabular">
          {centerLabel !== undefined ? centerLabel : `${pctA}%`}
        </strong>
        {(centerSub || label) && (
          <span className="text-[10px] font-mono text-[#C4A494] uppercase mt-1 tracking-wider">
            {centerSub || label}
          </span>
        )}
      </div>
    </div>
  );
}

export default DonutChart;
