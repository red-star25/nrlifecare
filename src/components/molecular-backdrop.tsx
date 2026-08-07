/**
 * Decorative hexagonal-lattice + bond-node field used behind dark sections.
 * Pure SVG so it costs nothing at runtime and scales crisply.
 */
export function MolecularBackdrop({ className = "" }: { className?: string }) {
  const nodes = [
    { cx: 12, cy: 22, r: 2.4, o: 0.55 },
    { cx: 28, cy: 12, r: 1.6, o: 0.35 },
    { cx: 34, cy: 38, r: 3, o: 0.5 },
    { cx: 58, cy: 20, r: 2, o: 0.4 },
    { cx: 72, cy: 44, r: 2.6, o: 0.45 },
    { cx: 88, cy: 26, r: 1.8, o: 0.3 },
    { cx: 20, cy: 62, r: 2.2, o: 0.4 },
    { cx: 46, cy: 74, r: 2.8, o: 0.45 },
    { cx: 66, cy: 88, r: 2, o: 0.3 },
    { cx: 90, cy: 70, r: 2.4, o: 0.4 },
  ];

  const bonds: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 4],
    [3, 4],
    [3, 5],
    [0, 6],
    [2, 7],
    [6, 7],
    [4, 9],
    [7, 8],
    [8, 9],
  ];

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bond-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8e7cd8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8e7cd8" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="node-grad">
          <stop offset="0%" stopColor="#d5cff3" />
          <stop offset="100%" stopColor="#6f57c6" />
        </radialGradient>
      </defs>

      <g stroke="url(#bond-grad)" strokeWidth="0.22">
        {bonds.map(([a, b], index) => (
          <line
            key={index}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
          />
        ))}
      </g>

      <g fill="url(#node-grad)">
        {nodes.map((node, index) => (
          <circle
            key={index}
            cx={node.cx}
            cy={node.cy}
            r={node.r * 0.32}
            opacity={node.o}
          >
            <animate
              attributeName="opacity"
              values={`${node.o};${node.o * 0.35};${node.o}`}
              dur={`${4 + (index % 5)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  );
}
