type MedistorLogoProps = {
  className?: string;
  textColor?: string; // default: #0B1F33
};

export const MedistorLogo = ({
  className,
  textColor = "#0B1F33",
}: MedistorLogoProps) => {
  return (
    <svg
      className={className}
      width="520"
      height="180"
      viewBox="0 0 520 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Medistor logo"
    >
      {/* ICON */}
      <g transform="translate(40,40)">
        <path
          d="M74 6c20 0 40 10 40 10v42c0 38-40 62-40 62S34 96 34 58V16S54 6 74 6Z"
          fill="url(#shieldFill)"
          stroke="url(#shieldStroke)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M74 12c17 0 34 8.5 34 8.5v37.5c0 30-34 50.5-34 50.5S40 88 40 58V20.5S57 12 74 12Z"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="2"
          fill="none"
        />

        {/* Cross */}
        <g transform="translate(72,24)">
          <path
            d="M18 6c3.4 0 6 2.6 6 6v8h8c3.4 0 6 2.6 6 6s-2.6 6-6 6h-8v8c0 3.4-2.6 6-6 6s-6-2.6-6-6v-8H4c-3.4 0-6-2.6-6-6s2.6-6 6-6h8v-8c0-3.4 2.6-6 6-6Z"
            fill="#34D399"
            opacity="0.95"
          />
        </g>

        {/* Heartbeat */}
        <path
          d="M48 86h14l6-10 7 18 7-12h18"
          stroke="#0EA5E9"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* Pill */}
        <g transform="translate(26,18) rotate(-28 28 36)">
          <rect
            x="6"
            y="18"
            width="44"
            height="28"
            rx="14"
            fill="url(#pillFill)"
            stroke="#06B6D4"
            strokeWidth="3"
          />
          <path d="M28 18v28" stroke="#06B6D4" strokeWidth="3" opacity="0.7" />
          <path
            d="M14 26c4-6 12-9 18-6"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* WORDMARK */}
      <text
        x="220"
        y="110"
        fill={textColor}
        fontSize="64"
        fontWeight="800"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
        letterSpacing="-1"
      >
        Medistor
      </text>

      <defs>
        <linearGradient
          id="shieldFill"
          x1="34"
          y1="6"
          x2="114"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#10B981" stopOpacity="0.22" />
          <stop offset="1" stopColor="#0EA5E9" stopOpacity="0.22" />
        </linearGradient>

        <linearGradient
          id="shieldStroke"
          x1="34"
          y1="6"
          x2="114"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#06B6D4" stopOpacity="0.9" />
          <stop offset="1" stopColor="#10B981" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient
          id="pillFill"
          x1="6"
          y1="18"
          x2="50"
          y2="46"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E6FBFF" />
          <stop offset="1" stopColor="#7DE3F5" />
        </linearGradient>
      </defs>
    </svg>
  );
};
