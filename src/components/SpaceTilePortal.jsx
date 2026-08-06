import {useId} from "react";
import Treasures from "./Treasures.jsx";


export const SpaceTilePortal = ({tileRotate, angle = 0, translate = {x:0,y:0}, treasure = null, onClick, player }) => {
    const baseId = useId();
    const portalGlowId = `${baseId}-portalGlow`;
    const vortexGradId = `${baseId}-vortexGrad`;


    return (
        <g transform={`translate(${translate.x}, ${translate.y})`}>
            <defs>
                <filter id={portalGlowId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <radialGradient id={vortexGradId} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="50%" stopColor="#7000FF" />
                    <stop offset="100%" stopColor="#0B0F17" />
                </radialGradient>
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
                d="M10 10L25 25M90 10L75 25M10 90L25 75M90 90L75 75"
                stroke="#2D3748"
                strokeWidth="1.5"
                opacity="0.4"
            />

            <g transform="translate(50, 50)">
                <circle r="38" fill="none" stroke="#2D3748" strokeWidth="2" />
                <circle
                    r="38"
                    fill="none"
                    stroke="#7000FF"
                    strokeWidth="2"
                    strokeDasharray="12 8"
                    filter={`url(#${portalGlowId})`}
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0"
                        to="360"
                        dur="8s"
                        repeatCount="indefinite"
                    />
                </circle>

                <circle r="26" fill={`url(#${vortexGradId})`} opacity="0.9">
                    <animate
                        attributeName="r"
                        values="24;27;24"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </circle>

                <g filter={`url(#${portalGlowId})`}>
                    <ellipse rx="18" ry="8" fill="none" stroke="#00F0FF" strokeWidth="1.5">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0"
                            to="-360"
                            dur="3s"
                            repeatCount="indefinite"
                        />
                    </ellipse>
                    <ellipse rx="18" ry="8" fill="none" stroke="#FF0055" strokeWidth="1.5">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="90"
                            to="270"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                    </ellipse>
                </g>

                <circle r="6" fill="#0B0F17" stroke="#00F0FF" strokeWidth="1.5" />

                <text
                    x="0"
                    y="44"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontSize="6"
                    fill="#00F0FF"
                    fontWeight="bold"
                    letterSpacing="1"
                >
                    PORTAL-LINK
                </text>
            </g>
            <Treasures treasure={treasure}/>
        </g>
    );
};

export default SpaceTilePortal;