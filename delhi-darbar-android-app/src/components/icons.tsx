type IconProps = { className?: string };

function base(props: IconProps) {
  return {
    className: props.className ?? "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

export function ChefHatIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6.5 11.2A3.5 3.5 0 0 1 7 4.3a4.5 4.5 0 0 1 10 0 3.5 3.5 0 0 1 .5 6.9V17h-17" />
      <path d="M4 17v3h16v-3" />
      <path d="M9 20v-3M12 20v-3M15 20v-3" />
    </svg>
  );
}

export function ReceiptIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z" />
      <path d="M9 7.5h6M9 11h6M9 14.5h4" />
    </svg>
  );
}

export function PhoneIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function UserIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function BackIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function PlusIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function PinIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ClockIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function CashIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="7" width="18" height="11" rx="2" />
      <circle cx="12" cy="12.5" r="2.5" />
      <path d="M6.5 10.5v.01M17.5 14.5v.01" />
    </svg>
  );
}

export function CardIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10.5h18M7 15.5h4" />
    </svg>
  );
}

export function TruckIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  );
}

export function PotIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 10h14v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z" />
      <path d="M3 10h18M9 6.5c0-1 .8-1 .8-2M13.5 6.5c0-1 .8-1 .8-2" />
    </svg>
  );
}

export function ShieldIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3l7 2.8V12c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V5.8z" />
      <path d="M9 12l2.2 2.2L15.5 9.7" />
    </svg>
  );
}

export function SparkIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </svg>
  );
}

export function CakeIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 13h14v7H5z" />
      <path d="M5 16c1.5 1.4 3-1.2 4.5 0s3-1.2 4.5 0 3-1.2 5 0" />
      <path d="M12 13V9M12 6.5v.01" />
      <path d="M9 9.5V7.8M15 9.5V7.8" />
    </svg>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l5 5" />
    </svg>
  );
}

export function TrashIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4.5 7h15M9 7V5h6v2M7 7l.8 13h8.4L17 7" />
      <path d="M10.5 11v5M13.5 11v5" />
    </svg>
  );
}

export function ArrowRightIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function GoogleIcon({ className }: IconProps) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none">
      <path
        d="M21.6 12.2c0-.7-.06-1.4-.18-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z"
        fill="#F2B84B"
      />
      <path
        d="M12 21.5c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 21.5z"
        fill="#FF7A1F"
      />
      <path
        d="M6.4 13.5a6 6 0 0 1 0-3.8V7H3.1a10 10 0 0 0 0 9z"
        fill="#F5EDDD"
      />
      <path
        d="M12 6.4c1.5 0 2.8.5 3.8 1.5L18.7 5A10 10 0 0 0 3.1 7l3.3 2.6C7.2 7.2 9.4 5.5 12 5.5z"
        fill="#E85A4E"
      />
    </svg>
  );
}
