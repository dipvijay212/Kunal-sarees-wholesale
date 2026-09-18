import type { ReactNode, SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function createIcon(displayName: string, children: ReactNode, { filled = false } = {}) {
  function Icon({ size = 20, strokeWidth = 1.25, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {children}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

export const MenuIcon = createIcon("MenuIcon", <path d="M3 7h18M3 12h18M3 17h12" />);

export const CloseIcon = createIcon("CloseIcon", <path d="M6 6l12 12M18 6 6 18" />);

export const HeartIcon = createIcon(
  "HeartIcon",
  <path d="M12 20.25s-7.5-4.35-7.5-10.1A4.15 4.15 0 0 1 12 7.8a4.15 4.15 0 0 1 7.5 2.35c0 5.75-7.5 10.1-7.5 10.1Z" />,
);

export const BagIcon = createIcon(
  "BagIcon",
  <>
    <path d="M5.25 8.25h13.5l-1 12H6.25l-1-12Z" />
    <path d="M9 8.25V6.75a3 3 0 0 1 6 0v1.5" />
  </>,
);

export const ArrowRightIcon = createIcon("ArrowRightIcon", <path d="M4 12h16m-5-5 5 5-5 5" />);

export const ArrowLeftIcon = createIcon("ArrowLeftIcon", <path d="M20 12H4m5-5-5 5 5 5" />);

export const HomeIcon = createIcon(
  "HomeIcon",
  <path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5V15h-5v6h-5A1.5 1.5 0 0 1 3 19.5v-9Z" />,
);

export const ChevronLeftIcon = createIcon("ChevronLeftIcon", <path d="m15 5-7 7 7 7" />);

export const ChevronRightIcon = createIcon("ChevronRightIcon", <path d="m9 5 7 7-7 7" />);

export const ChevronDownIcon = createIcon("ChevronDownIcon", <path d="m5 9 7 7 7-7" />);

export const PlusIcon = createIcon("PlusIcon", <path d="M12 5v14M5 12h14" />);

export const MinusIcon = createIcon("MinusIcon", <path d="M5 12h14" />);

export const TrashIcon = createIcon(
  "TrashIcon",
  <>
    <path d="M4.5 6.75h15M9.75 6.75V4.5h4.5v2.25" />
    <path d="M6.75 6.75 7.5 19.5h9l.75-12.75M10.5 10.5v5.25M13.5 10.5v5.25" />
  </>,
);

export const CheckIcon = createIcon("CheckIcon", <path d="m5 12.5 4.5 4.5L19 7.5" />);

export const ExpandIcon = createIcon(
  "ExpandIcon",
  <path d="M14.25 4.5h5.25v5.25M9.75 19.5H4.5v-5.25M19.5 4.5l-6 6M4.5 19.5l6-6" />,
);

export const FilterIcon = createIcon(
  "FilterIcon",
  <path d="M4 7h10m4 0h2M4 17h4m4 0h8M16 5v4M10 15v4" />,
);

export const PhoneIcon = createIcon(
  "PhoneIcon",
  <path d="M6.6 3.75h2.1l1.3 4.2-2 1.25a11.3 11.3 0 0 0 6.8 6.8l1.25-2 4.2 1.3v2.1a1.8 1.8 0 0 1-1.95 1.8A16.9 16.9 0 0 1 4.8 5.7a1.8 1.8 0 0 1 1.8-1.95Z" />,
);

export const MapPinIcon = createIcon(
  "MapPinIcon",
  <>
    <path d="M12 21s6.75-5.4 6.75-11.25a6.75 6.75 0 1 0-13.5 0C5.25 15.6 12 21 12 21Z" />
    <circle cx="12" cy="9.75" r="2.25" />
  </>,
);

export const ClockIcon = createIcon(
  "ClockIcon",
  <>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 7.5V12l3 1.75" />
  </>,
);

export const PackageIcon = createIcon(
  "PackageIcon",
  <>
    <path d="m12 3 8.25 4.5v9L12 21l-8.25-4.5v-9L12 3Z" />
    <path d="m3.75 7.5 8.25 4.5 8.25-4.5M12 12v9" />
  </>,
);

export const ShieldCheckIcon = createIcon(
  "ShieldCheckIcon",
  <>
    <path d="M12 3.25 19.5 6v5.5c0 4.6-3.2 8.2-7.5 9.25-4.3-1.05-7.5-4.65-7.5-9.25V6L12 3.25Z" />
    <path d="m9 12 2.1 2.1L15.25 10" />
  </>,
);

export const SparkleIcon = createIcon(
  "SparkleIcon",
  <path d="M12 3.5c.6 4.3 2.9 6.9 8.5 8.5-5.6 1.6-7.9 4.2-8.5 8.5-.6-4.3-2.9-6.9-8.5-8.5 5.6-1.6 7.9-4.2 8.5-8.5Z" />,
);

export const TagIcon = createIcon(
  "TagIcon",
  <>
    <path d="M3.75 12.4V4.5a.75.75 0 0 1 .75-.75h7.9l8.1 8.1a1.5 1.5 0 0 1 0 2.12l-5.78 5.78a1.5 1.5 0 0 1-2.12 0l-8.85-7.35Z" />
    <circle cx="8.25" cy="8.25" r="1.25" />
  </>,
);

export const ChatIcon = createIcon(
  "ChatIcon",
  <path d="M20.25 11.5c0 4.28-3.7 7.75-8.25 7.75a8.9 8.9 0 0 1-3.2-.6L3.75 20.25l1.5-4.1A7.4 7.4 0 0 1 3.75 11.5c0-4.28 3.7-7.75 8.25-7.75s8.25 3.47 8.25 7.75Z" />,
);

export const SearchIcon = createIcon(
  "SearchIcon",
  <>
    <circle cx="10.75" cy="10.75" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </>,
);

export const MailIcon = createIcon(
  "MailIcon",
  <>
    <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="1.5" />
    <path d="m3.75 6.5 8.25 6.25 8.25-6.25" />
  </>,
);

export const ArrowUpRightIcon = createIcon("ArrowUpRightIcon", <path d="M7 17 17 7M8.5 7H17v8.5" />);

export const InstagramIcon = createIcon(
  "InstagramIcon",
  <>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.75" />
    <circle cx="12" cy="12" r="3.9" />
    <circle cx="17.15" cy="6.85" r="0.6" fill="currentColor" />
  </>,
);

export const FacebookIcon = createIcon(
  "FacebookIcon",
  <path d="M13.5 21v-7.5h2.6l.4-3.1h-3V8.5c0-.9.25-1.5 1.55-1.5h1.6V4.2a21 21 0 0 0-2.35-.12c-2.3 0-3.9 1.4-3.9 4v2.3H7.8v3.1h2.6V21" />,
);

export const YouTubeIcon = createIcon(
  "YouTubeIcon",
  <>
    <rect x="2.75" y="5.5" width="18.5" height="13" rx="3.5" />
    <path d="m10.25 9.25 4.75 2.75-4.75 2.75v-5.5Z" />
  </>,
);

export const WhatsAppIcon = createIcon(
  "WhatsAppIcon",
  <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01Zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.23 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />,
  { filled: true },
);
