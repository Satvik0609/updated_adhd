import React from "react";

function Svg({ children, size = 24, className = "", stroke = 2 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={stroke}
      stroke="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function Icon({ name, size = 24, className = "", stroke = 2 }) {
  switch (name) {
    case "upload":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 16.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5" />
        </Svg>
      );
    case "file":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 3v6h6" />
        </Svg>
      );
    case "file-pdf":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 9h3a2 2 0 0 1 0 4H8zM14 9h2a0.5 0.5 0 0 1 .5.5V11M14 13h2" strokeLinecap="round" />
        </Svg>
      );
    case "file-ppt":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 9h3a2 2 0 1 1 0 4H8zM14 9h2M14 13h2" strokeLinecap="round" />
        </Svg>
      );
    case "x":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
        </Svg>
      );
    case "arrow-right":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
        </Svg>
      );
    case "warning":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </Svg>
      );
    case "copy":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <rect x="9" y="9" width="10" height="10" rx="2" />
          <rect x="5" y="5" width="10" height="10" rx="2" />
        </Svg>
      );
    case "download":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 21h16" />
        </Svg>
      );
    case "record-dot":
      return (
        <Svg size={size} className={className} stroke={0}>
          <circle cx="12" cy="12" r="6" fill="currentColor" />
        </Svg>
      );
    case "stop":
      return (
        <Svg size={size} className={className} stroke={0}>
          <rect x="7" y="7" width="10" height="10" fill="currentColor" rx="2" />
        </Svg>
      );
    case "clock":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 7v6l4 2" />
        </Svg>
      );
    case "video":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <rect x="3" y="7" width="13" height="10" rx="2" />
          <path d="M16 10l5-3v10l-5-3z" />
        </Svg>
      );
    case "music":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6l9-2v12" />
          <circle cx="9" cy="18" r="2" />
          <circle cx="18" cy="16" r="2" />
        </Svg>
      );
    case "send":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12l16-8-7 16-2-6-7-2z" />
        </Svg>
      );
    case "check-circle":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-6" />
        </Svg>
      );
    case "user":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" />
          <circle cx="12" cy="7" r="4" />
        </Svg>
      );
    case "bot":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <rect x="5" y="6" width="14" height="12" rx="3" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="15" cy="12" r="1" />
          <path d="M12 6V3" strokeLinecap="round" />
        </Svg>
      );
    case "message-circle":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a8 8 0 0 1-8 8H9l-4 3v-5a8 8 0 1 1 16-6z" />
        </Svg>
      );
    case "calendar":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 9h18" strokeLinecap="round" />
        </Svg>
      );
    case "eye":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </Svg>
      );
    case "eye-off":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path d="M3 3l18 18" strokeLinecap="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 3-3 2.99 2.99 0 0 0-.59-1.76M7.7 7.7C5.1 8.9 3 12 3 12s4 7 9 7c1.46 0 2.8-.36 4-.99" />
        </Svg>
      );
    case "play":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <polygon points="8 5 8 19 19 12" fill="currentColor" />
        </Svg>
      );
    case "pause":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <rect x="8" y="5" width="4" height="14" fill="currentColor" />
          <rect x="12" y="5" width="4" height="14" fill="currentColor" />
        </Svg>
      );
    case "refresh":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20l5-5M20 4l-5 5" />
        </Svg>
      );
    case "coffee":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 9v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9" />
          <path strokeLinecap="round" d="M9 3v2M15 3v2" />
        </Svg>
      );
    case "moon":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z" />
        </Svg>
      );
    case "plus":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </Svg>
      );
    case "bell":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
        </Svg>
      );
    case "shield":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </Svg>
      );
    case "lock":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path strokeLinecap="round" d="M12 11V7a3 3 0 1 0-6 0v4" />
        </Svg>
      );
    case "flame":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 0 1 6.343 7.343S7 9 9 10c0-2 .5-5 2.5-7C13.5 5 16 7 17.657 8.343A7.975 7.975 0 0 1 20 13a7.975 7.975 0 0 1-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1 0 12.121 13.88 3 3 0 0 0 9.88 16.12z" />
        </Svg>
      );
    case "trophy":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 3h10M5 7H3a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2m0 0v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4m0 0h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2M9 3h6" />
        </Svg>
      );
    case "save":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </Svg>
      );
    case "sun":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </Svg>
      );
    case "refresh-cw":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20l5-5M20 4l-5 5" />
        </Svg>
      );
    case "home":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" />
        </Svg>
      );
    case "info":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
        </Svg>
      );
    case "edit":
      return (
        <Svg size={size} className={className} stroke={stroke}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </Svg>
      );
    default:
      return null;
  }
}

export default Icon;