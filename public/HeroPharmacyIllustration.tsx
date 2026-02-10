import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

export default function HeroPharmacyIllustration({
  title = "Medistor hero illustration",
  ...props
}: Props) {
  return (
    <svg
      viewBox="0 0 1200 900"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="pillGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.10" />
        </linearGradient>

        <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
        </linearGradient>

        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodOpacity="0.18" />
        </filter>

        <filter id="blur20" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="20" />
        </filter>

        <clipPath id="cardClip">
          <rect x="140" y="120" width="920" height="660" rx="44" />
        </clipPath>
      </defs>

      {/* Base */}
      <rect x="0" y="0" width="1200" height="900" fill="transparent" />

      {/* Soft background blobs */}
      <g opacity="0.9" filter="url(#blur20)">
        <circle cx="280" cy="260" r="220" fill="url(#bgGlow)" />
        <circle cx="930" cy="290" r="240" fill="url(#bgGlow)" />
        <circle cx="650" cy="720" r="280" fill="url(#bgGlow)" />
      </g>

      {/* Main card */}
      <g filter="url(#softShadow)">
        <rect
          x="140"
          y="120"
          width="920"
          height="660"
          rx="44"
          fill="currentColor"
          opacity="0.06"
        />
        <rect
          x="160"
          y="140"
          width="880"
          height="620"
          rx="40"
          fill="currentColor"
          opacity="0.06"
        />
      </g>

      {/* Content inside */}
      <g clipPath="url(#cardClip)">
        {/* Grid lines */}
        <g opacity="0.14">
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="140"
              y1={160 + i * 70}
              x2="1060"
              y2={160 + i * 70}
              stroke="currentColor"
              strokeWidth="2"
            />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={160 + i * 80}
              y1="120"
              x2={160 + i * 80}
              y2="780"
              stroke="currentColor"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Big pill */}
        <g transform="translate(330 255) rotate(-12)">
          <rect
            x="0"
            y="0"
            width="520"
            height="240"
            rx="120"
            fill="url(#pillGrad)"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="6"
          />
          {/* Divider */}
          <line
            x1="260"
            y1="28"
            x2="260"
            y2="212"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="6"
          />

          {/* Top highlight */}
          <path
            d="M78 38 C145 12, 230 6, 330 20 C390 28, 435 42, 470 62"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.25"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Small dots */}
          <g opacity="0.22" fill="currentColor">
            {Array.from({ length: 9 }).map((_, i) => (
              <circle key={i} cx={80 + i * 40} cy={170} r="7" />
            ))}
          </g>
        </g>

        {/* Medical cross badge */}
        <g transform="translate(215 515)">
          <rect
            x="0"
            y="0"
            width="210"
            height="210"
            rx="36"
            fill="currentColor"
            opacity="0.10"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="4"
          />
          <g transform="translate(55 55)">
            <rect
              x="40"
              y="0"
              width="20"
              height="100"
              rx="10"
              fill="currentColor"
              opacity="0.34"
            />
            <rect
              x="0"
              y="40"
              width="100"
              height="20"
              rx="10"
              fill="currentColor"
              opacity="0.34"
            />
          </g>
        </g>

        {/* Delivery / motion lines */}
        <g
          transform="translate(760 560)"
          opacity="0.22"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        >
          <path d="M0 30 H160" />
          <path d="M20 70 H180" />
          <path d="M40 110 H150" />
        </g>

        {/* Small “glass” tag */}
        <g transform="translate(740 205)">
          <rect
            x="0"
            y="0"
            width="250"
            height="110"
            rx="28"
            fill="url(#glassGrad)"
            opacity="0.7"
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeWidth="3"
          />
          <circle cx="48" cy="55" r="18" fill="currentColor" opacity="0.22" />
          <rect
            x="80"
            y="38"
            width="130"
            height="14"
            rx="7"
            fill="currentColor"
            opacity="0.16"
          />
          <rect
            x="80"
            y="62"
            width="95"
            height="12"
            rx="6"
            fill="currentColor"
            opacity="0.12"
          />
        </g>

        {/* Sparkles */}
        <g
          transform="translate(265 220)"
          opacity="0.28"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        >
          <path d="M0 26 H52" />
          <path d="M26 0 V52" />
          <path d="M9 9 L43 43" />
          <path d="M43 9 L9 43" />
        </g>

        <g
          transform="translate(980 420)"
          opacity="0.22"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        >
          <path d="M0 18 H40" />
          <path d="M20 0 V36" />
        </g>
      </g>

      {/* Border */}
      <rect
        x="140"
        y="120"
        width="920"
        height="660"
        rx="44"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="4"
      />
    </svg>
  );
}
