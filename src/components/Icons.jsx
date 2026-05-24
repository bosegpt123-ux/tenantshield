// SVG icon components — iOS outlined style, strokeWidth 1.5, round caps/joins
// All icons: 24×24 viewBox, stroke-based, no fill except where noted

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function ShieldIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6l-8-4z" />
    </svg>
  )
}

export function ScaleIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <line x1="12" y1="3" x2="12" y2="20" />
      <path d="M5 7l7-4 7 4" />
      <path d="M3 11l4 6H3l4-6z" />
      <path d="M21 11l-4 6h8l-4-6z" />
      <line x1="5" y1="20" x2="19" y2="20" />
    </svg>
  )
}

export function DocumentIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="8" y1="9" x2="10" y2="9" />
    </svg>
  )
}

export function MailIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22 6 12 13 2 6" />
    </svg>
  )
}

export function FlameIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17l.5.5c.83.83 2.17.83 3 0l.5-.5A2.5 2.5 0 0 0 17.5 14c0-1.38-.56-2.63-1.46-3.54L14 8.5V4.5c0-.28-.22-.5-.5-.5S13 4.22 13 4.5v1.26l-1 .74V4.5c0-.28-.22-.5-.5-.5S11 4.22 11 4.5V7l-1.04-1.04A7.5 7.5 0 0 0 8.5 14.5z" />
    </svg>
  )
}

export function ShowerIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M4 12a8 8 0 0 1 16 0" />
      <line x1="12" y1="12" x2="12" y2="20" />
      <path d="M8 16l1 1M12 14v2M16 16l-1 1M10 20l1-1M14 20l-1-1" />
    </svg>
  )
}

export function AlertIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export function CreditCardIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

export function KeyIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  )
}

export function ClipboardIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  )
}

export function WrenchIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

export function HomeIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

export function ArrowRightIcon({ size = 16, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function ArrowLeftIcon({ size = 16, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

export function CheckIcon({ size = 16, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function ChevronDownIcon({ size = 14, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function CopyIcon({ size = 16, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export function RefreshIcon({ size = 14, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-5" />
    </svg>
  )
}

export function SpinnerIcon({ size = 16, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} className="animate-spin-smooth" {...props}>
      <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
      <path d="M12 3a9 9 0 0 1 9 9" />
    </svg>
  )
}

export function WarningIcon({ size = 16, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export function CheckCircleIcon({ size = 16, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

export function TrendingUpIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

export function RetaliationIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6l-8-4z" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  )
}

export function BugIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M8 2l1.88 1.88M14.12 3.88L16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z" />
      <path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  )
}

export function ZapOffIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="12.41 6.75 13 2 10.57 4.92" />
      <polyline points="18.57 12.91 21 10 15.66 10" />
      <polyline points="8 8 3 14 12 14 11 22 16 16" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export function UnsafeHomeIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <line x1="12" y1="13" x2="12" y2="17" />
      <line x1="12" y1="21" x2="12.01" y2="21" />
    </svg>
  )
}

export function EqualRightsIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="15" x2="16" y2="15" />
    </svg>
  )
}

export function ShareIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

export function PrinterIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}

export function CalendarIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function MapPinIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function UsersIcon({ size = 24, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
