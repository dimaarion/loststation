import React, { useId } from 'react';

export const SpaceTileGateway = ({ angle = 0, translate = {x:0,y:0}, onClick, complete = false }) => {
    const baseId = useId();
    const clipPathId = `${baseId}-clip-path`;
    const gradientId = `${baseId}-gradient`;
    let color = complete?"red":"green"
    return (
        <g transform={`translate(${translate.x}, ${translate.y})`} onClick={()=>onClick(translate.x / 100, translate.y / 100)}>
            <defs>
                <clipPath id={clipPathId}>
                    <rect width="100" height="100" />
                </clipPath>
                <radialGradient
                    id={gradientId}
                    gradientUnits="userSpaceOnUse"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientTransform="matrix(42 0 0 42 42 42)"
                >
                    <stop offset="0" stopColor="#2D3748" />
                    <stop offset="0.8" stopColor="#1A202C" />
                    <stop offset="1" stopColor="#0F1219" />
                </radialGradient>
            </defs>
            <g clipPath={`url(#${clipPathId})`}>
                <path
                    d="M0 12L0 6C0 4.34315 0.585786 2.92893 1.75736 1.75736C2.92893 0.585786 4.34315 0 6 0L94 0C95.6568 0 97.0711 0.585786 98.2426 1.75736C99.4142 2.92893 100 4.34315 100 6L100 94C100 95.6568 99.4142 97.0711 98.2426 98.2426C97.0711 99.4142 95.6568 100 94 100L6 100C4.34315 100 2.92893 99.4142 1.75736 98.2426C0.585786 97.0711 0 95.6568 0 94L0 12Z"
                    fill="#161B22"
                    fillRule="evenodd"
                    strokeWidth="3"
                    stroke="#0D1117"
                />
                <path
                    d="M0 15L15 0M100 15L85 0M0 85L15 100M100 85L85 100"
                    fill="none"
                    strokeWidth="2"
                    stroke={color}
                />
                <path
                    d="M0 42C0 18.804 18.804 0 42 0C65.196 0 84 18.804 84 42C84 65.196 65.196 84 42 84C18.804 84 0 65.196 0 42Z"
                    fill={`url(#${gradientId})`}
                    fillRule="evenodd"
                    strokeWidth="3"
                    stroke={color}
                    transform="translate(8 8)"
                />
                <path
                    d="M0 38C0 17.0132 17.0132 0 38 0C58.9868 0 76 17.0132 76 38C76 58.9868 58.9868 76 38 76C17.0132 76 0 58.9868 0 38Z"
                    fill="none"
                    strokeWidth="1"
                    stroke={color}
                    strokeDasharray="2 4"
                    transform="translate(12 12)"
                />
                <g transform="translate(35 12)">
                    <path
                        d="M0 4L0 2C0 1.44772 0.195262 0.976311 0.585786 0.585786C0.976311 0.195262 1.44772 0 2 0L28 0C28.5523 0 29.0237 0.195262 29.4142 0.585786C29.8047 0.976311 30 1.44772 30 2L30 8C30 8.55228 29.8047 9.02369 29.4142 9.41421C29.0237 9.80474 28.5523 10 28 10L2 10C1.44772 10 0.976311 9.80474 0.585786 9.41421C0.195262 9.02369 0 8.55228 0 8L0 4Z"
                        fill="#FAD02C"
                        fillRule="evenodd"
                    />
                    <path
                        d="M0 0C0 0 10 10 10 10L0 10C0 10 0 0 0 0ZM10 0C10 0 20 10 20 10L10 10C10 10 10 0 10 0ZM20 0C20 0 30 10 30 10L20 10C20 10 20 0 20 0Z"
                        fill="#000000"
                    />
                </g>
                <g transform="translate(35 78)">
                    <path
                        d="M0 4L0 2C0 1.44772 0.195262 0.976311 0.585786 0.585786C0.976311 0.195262 1.44772 0 2 0L28 0C28.5523 0 29.0237 0.195262 29.4142 0.585786C29.8047 0.976311 30 1.44772 30 2L30 8C30 8.55228 29.8047 9.02369 29.4142 9.41421C29.0237 9.80474 28.5523 10 28 10L2 10C1.44772 10 0.976311 9.80474 0.585786 9.41421C0.195262 9.02369 0 8.55228 0 8L0 4Z"
                        fill="#FAD02C"
                        fillRule="evenodd"
                    />
                    <path
                        d="M0 0C0 0 10 10 10 10L0 10C0 10 0 0 0 0ZM10 0C10 0 20 10 20 10L10 10C10 10 10 0 10 0ZM20 0C20 0 30 10 30 10L20 10C20 10 20 0 20 0Z"
                        fill="#000000"
                    />
                </g>
                <g transform="translate(32 21.968)">
                    <path
                        d="M0 18C0 8.05887 8.05887 0 18 0C27.9411 0 36 8.05887 36 18C36 27.9411 27.9411 36 18 36C8.05887 36 0 27.9411 0 18Z"
                        fill="none"
                        strokeWidth="4"
                        stroke={color}
                        transform="translate(0 10.032)"
                    />
                    <path
                        d="M0 18C0 8.05887 8.05887 0 18 0C27.9411 0 36 8.05887 36 18C36 27.9411 27.9411 36 18 36C8.05887 36 0 27.9411 0 18Z"
                        fill="none"
                        strokeWidth="1"
                        stroke="#0D1117"
                        strokeDasharray="3 3"
                        transform="translate(0 10.032)"
                    />
                    <path
                        d="M18 0L18 36M0 18L36 18"
                        fill="none"
                        strokeWidth="3"
                        stroke="#4A5568"
                        strokeLinecap="round"
                        transform="translate(0 10.032)"
                    />
                    <path
                        d="M0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6Z"
                        fill="#1A202C"
                        fillRule="evenodd"
                        strokeWidth="2"
                        stroke="#0D1117"
                        transform="translate(12 22.032)"
                    />
                    <path
                        d="M0 2C0 0.89543 0.89543 0 2 0C3.10457 0 4 0.89543 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2Z"
                        fill="#4A5568"
                        fillRule="evenodd"
                        transform="translate(16 26.032)"
                    />
                    <text
                        fontSize={10}
                        fill="#8B949E"
                        transform="translate(8 6)">
                        Шлюз
                    </text>
                </g>
                <g transform="translate(5 25)">
                    <path
                        d="M0 2L0 1C0 0.723858 0.0976311 0.488155 0.292893 0.292892C0.488155 0.0976315 0.723858 0 1 0L3 0C3.27614 0 3.51184 0.0976315 3.70711 0.292892C3.90237 0.488155 4 0.723858 4 1L4 9C4 9.27614 3.90237 9.51184 3.70711 9.70711C3.51184 9.90237 3.27614 10 3 10L1 10C0.723858 10 0.488155 9.90237 0.292893 9.70711C0.0976311 9.51184 0 9.27614 0 9L0 2Z"
                        fill="#00F0FF"
                        fillRule="evenodd"
                        transform="translate(0 20)"
                    />
                    <path
                        d="M0 2L0 1C0 0.723858 0.0976334 0.488155 0.292892 0.292892C0.488152 0.0976315 0.723854 0 1 0L3 0C3.27615 0 3.51184 0.0976315 3.70711 0.292892C3.90237 0.488155 4 0.723858 4 1L4 9C4 9.27614 3.90237 9.51184 3.70711 9.70711C3.51184 9.90237 3.27615 10 3 10L1 10C0.723854 10 0.488152 9.90237 0.292892 9.70711C0.0976334 9.51184 0 9.27614 0 9L0 2Z"
                        fill="#00F0FF"
                        fillRule="evenodd"
                        transform="translate(86 20)"
                    />
                    <path
                        d="M0 0L0 50"
                        fill="none"
                        strokeWidth="2"
                        stroke="#00F0FF"
                        strokeOpacity="0.6"
                        strokeLinecap="round"
                        strokeDasharray="1 8"
                        transform="translate(45 0)"
                    />
                </g>
            </g>
        </g>
    );
};

export default SpaceTileGateway;