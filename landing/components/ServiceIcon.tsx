type IconProps = {
  width?: number;
  height?: number;
  className?: string;
};

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function ServiceIcon({ index, width = 22, height = 22, className }: IconProps & { index: number }) {
  const props = { ...svgProps, width, height, className, "aria-hidden": true as const };

  switch (index) {
    case 0:
      return (
        <svg {...props}>
          <rect x="5" y="5" width="14" height="14" rx="1" />
          <path d="M5 12h14M12 5v14" />
        </svg>
      );
    case 1:
      return (
        <svg {...props}>
          <rect x="3" y="11" width="18" height="7" rx="1" />
        </svg>
      );
    case 2:
      return (
        <svg {...props}>
          <path d="M5 19V13h5V8h5V5h5" />
        </svg>
      );
    case 3:
      return (
        <svg {...props}>
          <path d="M4 11l8-6 8 6" />
          <path d="M7 10v10h10V10" />
        </svg>
      );
    case 4:
      return (
        <svg {...props}>
          <path d="M4 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
        </svg>
      );
    case 5:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8 12l3 3 5-6" />
        </svg>
      );
    default:
      return null;
  }
}

export function ProcessStepIcon({ index, width = 20, height = 20, className }: IconProps & { index: number }) {
  const props = { ...svgProps, width, height, className, "aria-hidden": true as const };

  switch (index) {
    case 0:
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 1:
      return (
        <svg {...props}>
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      );
    case 2:
      return (
        <svg {...props}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 3:
      return (
        <svg {...props}>
          <path d="M5 17h14v-5H5z" />
          <path d="M5 12V7l7-4 7 4v5" />
          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="16.5" cy="17.5" r="1.5" />
        </svg>
      );
    default:
      return null;
  }
}
