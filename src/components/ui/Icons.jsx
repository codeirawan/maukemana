const props = (s = 16) => ({
  width: s, height: s, viewBox: "0 0 24 24",
  fill: "none", stroke: "currentColor",
  strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
});

export const IconSun = ({ size = 16 }) => (
  <svg {...props(size)}>
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

export const IconMoon = ({ size = 16 }) => (
  <svg {...props(size)}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export const IconCoffee = ({ size = 16 }) => (
  <svg {...props(size)}>
    <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
    <line x1="6" y1="2" x2="6" y2="4"/>
    <line x1="10" y1="2" x2="10" y2="4"/>
    <line x1="14" y1="2" x2="14" y2="4"/>
  </svg>
);

export const IconUser = ({ size = 16 }) => (
  <svg {...props(size)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export const IconUtensils = ({ size = 16 }) => (
  <svg {...props(size)}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
    <path d="M7 2v20"/>
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>
    <path d="M21 15v7"/>
  </svg>
);

export const IconMapPin = ({ size = 16 }) => (
  <svg {...props(size)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

export const IconBuilding = ({ size = 16 }) => (
  <svg {...props(size)}>
    <rect width="16" height="20" x="4" y="2" rx="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>
  </svg>
);

export const IconCamera = ({ size = 16 }) => (
  <svg {...props(size)}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
);

export const IconLock = ({ size = 16 }) => (
  <svg {...props(size)}>
    <rect width="18" height="11" x="3" y="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export const IconMap = ({ size = 16 }) => (
  <svg {...props(size)}>
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/>
    <line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);

export const IconMessage = ({ size = 16 }) => (
  <svg {...props(size)}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

export const IconTrash = ({ size = 16 }) => (
  <svg {...props(size)}>
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

export const IconEdit = ({ size = 16 }) => (
  <svg {...props(size)}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export const IconRotateCCW = ({ size = 16 }) => (
  <svg {...props(size)}>
    <path d="M3 2v6h6"/>
    <path d="M3 8C5.7 4.7 9.1 3 13 3a9 9 0 1 1-9 9"/>
  </svg>
);

export const IconX = ({ size = 16 }) => (
  <svg {...props(size)}>
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);

export const IconCheck = ({ size = 16 }) => (
  <svg {...props(size)}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

export const IconCalendar = ({ size = 16 }) => (
  <svg {...props(size)}>
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export const IconClock = ({ size = 16 }) => (
  <svg {...props(size)}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export const IconChevronDown = ({ size = 16 }) => (
  <svg {...props(size)}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

export const IconCompass = ({ size = 16 }) => (
  <svg {...props(size)}>
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);
