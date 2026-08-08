import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 16 16 8M9 8h7v7" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3.5 5.2 2 2 0 0 1 5.5 3h1Z" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 7 7.4 5.4a2 2 0 0 0 2.2 0L20.5 7" />
    </svg>
  );
}

export function MapPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.4 2" />
    </svg>
  );
}

export function WhatsApp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2.05 22l5.34-1.4a9.83 9.83 0 0 0 4.65 1.18h.01c5.43 0 9.85-4.42 9.85-9.86C21.9 6.42 17.48 2 12.04 2Zm0 18.04h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.16 8.16 0 0 1-1.25-4.34c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.86 5.8 2.41a8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.17-8.2 8.17Zm4.5-6.12c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.04-.39-1.98-1.23-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.73 2.64 4.2 3.7.58.26 1.04.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Search(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

export function Flask(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9.5 3v6.2L4.6 17.4A2.4 2.4 0 0 0 6.7 21h10.6a2.4 2.4 0 0 0 2.1-3.6L14.5 9.2V3" />
      <path d="M8 3h8M7.3 14.5h9.4" />
    </svg>
  );
}

export function Molecule(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="17" r="2.2" />
      <circle cx="19" cy="17" r="2.2" />
      <path d="M10.6 6.9 6.4 15.1M13.4 6.9l4.2 8.2M7.2 17h9.6" />
    </svg>
  );
}

export function Shield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.8 20 6v6c0 4.6-3.3 7.9-8 9.2-4.7-1.3-8-4.6-8-9.2V6l8-3.2Z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </svg>
  );
}

export function Document(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M8.6 13h6.8M8.6 16.6h4.6" />
    </svg>
  );
}

export function Globe(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9.5h17.6M3.2 14.5h17.6" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </svg>
  );
}

export function Truck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  );
}

export function Layers(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 8.5 4.6L12 12.2 3.5 7.6 12 3Z" />
      <path d="m4 12 8 4.4 8-4.4M4 16.3l8 4.4 8-4.4" />
    </svg>
  );
}

export function Leaf(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 19.5C3 15 4.5 8 12 5.5c2.6-.9 5.4-1 7.5-1 .2 2.6 0 5.5-1 8-2.5 6.4-9.3 8-14 7Z" />
      <path d="M4.5 19.5 13 11" />
    </svg>
  );
}

export function Beaker(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h12M8 3v7.4L4.8 18a2.6 2.6 0 0 0 2.3 3.8h9.8a2.6 2.6 0 0 0 2.3-3.8L16 10.4V3" />
      <circle cx="10" cy="16.5" r="1" />
      <circle cx="14" cy="18.5" r="1" />
    </svg>
  );
}

export function Factory(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 21V10l6 3.5V10l6 3.5V6h6v15H3Z" />
      <path d="M7 17.5h1.5M12 17.5h1.5M17 17.5h1.5" />
    </svg>
  );
}

export const categoryIcons: Record<
  string,
  (props: IconProps) => React.JSX.Element
> = {
  "active-pharmaceutical-ingredients": Molecule,
  "antibiotic-powders": Shield,
  "human-steroid-apis": Beaker,
  "pharmaceutical-materials": Layers,
  "pharmaceutical-excipients": Layers,
  "pharmaceutical-intermediates": Beaker,
  "vitamins-and-minerals": Shield,
  "nutraceutical-ingredients": Leaf,
  "food-and-agro-chemicals": Flask,
  "chemical-powders": Factory,
  "industrial-and-specialty-chemicals": Factory,
  "organic-and-inorganic-chemicals": Flask,
  "veterinary-and-feed-additives": Truck,
};
