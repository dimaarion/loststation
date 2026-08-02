import {useId} from "react";
import Treasures from "./Treasures.jsx";
import {useSpring,animated} from "@react-spring/web";

export const SpaceTileAuto = ({translate = {x:0,y:0},treasure, angle, onClick, player }) => {
    const baseId = useId();
    const doorGradientId = `${baseId}-doorGradient`;
    const neonCyanGlowId = `${baseId}-neonCyanGlow`;
    const { rotation } = useSpring({
        rotation: angle, // Сюда передаем 0, 90, 180 или 270 градусов из стейта
        config: {
            duration:500,
        }
    });
    return (
        <g  transform={`translate(${translate.x}, ${translate.y})`}>

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
                    id={neonCyanGlowId}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <rect
                width="100"
                height="100"
                rx="8"
                fill="#161B22"
                stroke="#0D1117"
                strokeWidth="3"
            />

            <path
                d="M5 5L20 20M95 5L80 20M5 95L20 80M95 95L80 80"
                stroke="#0D1117"
                strokeWidth="2"
                opacity="0.5"
            />
            <animated.g transform={rotation.to(r => `rotate(${r}, 50, 50)`)}>
<g transform={'translate(50 50)'}>
    <g transform={'translate(0 0)'}>
        <circle
            r="42"
            fill={`url(#${doorGradientId})`}
            stroke="#0D1117"
            strokeWidth="3"
        />
        <circle
            r="38"
            fill="none"
            stroke="#2D3748"
            strokeWidth="1"
            strokeDasharray="2 4"
            opacity="0.5"
        />

        <g fill="#1A202C" stroke="#0D1117" strokeWidth="2">
            <path d="M-15 -42H15L10 -32H-10L-15 -42Z" />
            <rect x="-18" y="-45" width="36" height="5" rx="1" fill="#101419" />

            <path d="M42 -15V15L32 10V-10L42 -15Z" />
            <rect x="40" y="-18" width="5" height="36" rx="1" fill="#101419" />

            <path d="M15 42H-15L-10 32H10L15 42Z" />
            <rect x="-18" y="40" width="36" height="5" rx="1" fill="#101419" />
        </g>

        <g transform="translate(-42, 0)">
            <rect
                x="-3"
                y="-15"
                width="10"
                height="30"
                rx="2"
                fill="#161B22"
                stroke="#0D1117"
                strokeWidth="2"
            />
            <rect
                x="0"
                y="-10"
                width="4"
                height="20"
                rx="1"
                fill="#00F0FF"
                filter={`url(#${neonCyanGlowId})`}
            />
        </g>

        <g opacity="0.8">
            <circle r="18" fill="none" stroke="#4A5568" strokeWidth="4" />
            <path
                d="M0 -18V18M-18 0H18"
                stroke="#4A5568"
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
                fill="#8B949E"
                fontWeight="bold"
            >
                AUTO
            </text>
        </g>
    </g>
</g>
            </animated.g>
            <Treasures treasure={treasure}/>

        </g>
    );
};

export default SpaceTileAuto;