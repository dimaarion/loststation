import {useId} from "react";
import Treasures from "./Treasures.jsx";

export const SpaceTileLocked = ({translate = {x:0,y:0},treasure, onClick, player }) => {
    const baseId = useId();
    const doorGradientId = `${baseId}-doorGradient`;
    const neonRedGlowId = `${baseId}-neonRedGlow`;

    return (
        <g transform={`translate(${translate.x}, ${translate.y})`}>
            <defs>
                <radialGradient
                    id={doorGradientId}
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                >
                    <stop offset="0%" stopColor="#2D3748" />
                    <stop offset="80%" stopColor="#1A202C" />
                    <stop offset="100%" stopColor="#0F1219" />
                </radialGradient>

                <filter
                    id={neonRedGlowId}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <rect
                width="100"
                height="100"
                rx="6"
                fill="#161B22"
                stroke="#0D1117"
                strokeWidth="3"
            />
            <path
                d="M0 15L15 0M100 15L85 0M0 85L15 100M100 85L85 100"
                stroke="#0D1117"
                strokeWidth="2"
            />

            <circle
                cx="50"
                cy="50"
                r="42"
                fill={`url(#${doorGradientId})`}
                stroke="#0D1117"
                strokeWidth="3"
                opacity="0.6"
            />

            <g opacity="0.5">
                <g transform="translate(35, 12)">
                    <rect width="30" height="10" rx="2" fill="#AD9626" />
                    <path
                        d="M0 0L10 10H0V0ZM10 0L20 10H10V0ZM20 0L30 10H20V0Z"
                        fill="#000000"
                    />
                </g>
                <g transform="translate(35, 78)">
                    <rect width="30" height="10" rx="2" fill="#AD9626" />
                    <path
                        d="M0 0L10 10H0V0ZM10 0L20 10H10V0ZM20 0L30 10H20V0Z"
                        fill="#000000"
                    />
                </g>
            </g>

            <g transform="translate(50, 50)" opacity="0.4">
                <circle r="18" fill="none" stroke="#2D3748" strokeWidth="4" />
                <path
                    d="M0 -18V18M-18 0H18"
                    stroke="#2D3748"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <circle r="6" fill="#1A202C" stroke="#0D1117" strokeWidth="2" />
                <text
                    x="0"
                    y="-22"
                    textAnchor="middle"
                    fontFamily="Verdana, Geneva, sans-serif"
                    fontSize="6"
                    fill="#4A5568"
                    fontWeight="bold"
                >
                    LOCK
                </text>
            </g>

            <g transform="translate(50, 50)" filter={`url(#${neonRedGlowId})`}>
                <path
                    d="M-30 -30L30 30M30 -30L-30 30"
                    stroke="#FF1A4B"
                    strokeWidth="12"
                    strokeLinecap="round"
                    opacity="0.9"
                />

                <path
                    d="M-30 -30L30 30M30 -30L-30 30"
                    stroke="#FF0000"
                    strokeWidth="5"
                    strokeLinecap="round"
                />

                <circle r="12" fill="#161B22" stroke="#FF0000" strokeWidth="3" />
                <path
                    d="M-6 0H6"
                    stroke="#FF0000"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </g>
            <Treasures treasure={treasure}/>
        </g>
    );
};

export default SpaceTileLocked;