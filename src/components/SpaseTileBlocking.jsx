import {useSpring,animated} from "@react-spring/web";
import useStore from "../store.js";
import {RotateIcon} from "./Objects.jsx";

const SpaseTileBlocking = ({ angle = 0, translate = {x:0,y:0}, onClick, player }) => {
    const gamePhase = useStore((state) => state.gamePhase);
    const { rotation } = useSpring({
        rotation: angle, // Сюда передаем 0, 90, 180 или 270 градусов из стейта
        config: {
            duration:500,
        }
    });
    const  tileRotate  = useSpring({
        from:{transform:"rotate(0deg)"},
        to:[{transform:"rotate(360deg)"}],
        loop:true,
        config: {
            duration:5000
        }
    });
    const distance = Math.abs(player.x - translate.x / 100) + Math.abs(player.y - translate.y / 100);
   return (

        <g transform={`translate(${translate.x}, ${translate.y})`}
           onClick={() => onClick(translate.x / 100, translate.y / 100)}>
            <animated.g transform={rotation.to(r => `rotate(${r}, 50, 50)`)}>
                <defs>
                    <filter
                        colorInterpolationFilters="sRGB"
                        x={1.999}
                        y={-82}
                        width={0.001}
                        height={84}
                        id="filter_glow_pulse"
                    >
                        <feFlood floodOpacity={0} result="BackgroundImageFix_1"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix_1" result="Shape_2"/>
                        <feGaussianBlur stdDeviation={3}/>
                    </filter>
                </defs>
                <g>
                    <path
                        d="M0 16L0 8C0 5.79086 0.781049 3.90524 2.34315 2.34315C3.90524 0.781049 5.79086 0 8 0L92 0C94.2091 0 96.0947 0.781049 97.6568 2.34315C99.2189 3.90524 100 5.79086 100 8L100 92C100 94.2091 99.2189 96.0947 97.6568 97.6568C96.0947 99.2189 94.2091 100 92 100L8 100C5.79086 100 3.90524 99.2189 2.34315 97.6568C0.781049 96.0947 0 94.2091 0 92L0 16Z"
                        fill="#1A1F26"
                        fillRule="evenodd"
                        strokeWidth={2}
                        stroke="#0D1117"
                    />
                    <path
                        d="M0 1.5C0 0.671573 0.671573 0 1.5 0C2.32843 0 3 0.671573 3 1.5C3 2.32843 2.32843 3 1.5 3C0.671573 3 0 2.32843 0 1.5Z"
                        fill="#0D1117"
                        fillRule="evenodd"
                        transform="translate(4.5 4.5)"
                    />
                    <path
                        d="M0 1.5C0 0.67157 0.67157 0 1.5 0C2.32843 0 3 0.67157 3 1.5C3 2.32843 2.32843 3 1.5 3C0.67157 3 0 2.32843 0 1.5Z"
                        fill="#0D1117"
                        fillRule="evenodd"
                        transform="translate(92.5 4.5)"
                    />
                    <path
                        d="M0 1.5C0 0.67157 0.671573 0 1.5 0C2.32843 0 3 0.67157 3 1.5C3 2.32843 2.32843 3 1.5 3C0.671573 3 0 2.32843 0 1.5Z"
                        fill="#0D1117"
                        fillRule="evenodd"
                        transform="translate(4.5 92.5)"
                    />
                    <path
                        d="M0 1.5C0 0.67157 0.67157 0 1.5 0C2.32843 0 3 0.67157 3 1.5C3 2.32843 2.32843 3 1.5 3C0.67157 3 0 2.32843 0 1.5Z"
                        fill="#0D1117"
                        fillRule="evenodd"
                        transform="translate(92.5 92.5)"
                    />
                    <g transform="translate(35 0)">
                        <rect
                            width={30}
                            height={8}
                            fill="#1A1F26"
                            fillRule="evenodd"
                        />
                        <path
                            d="M0 0C0 0 10 8 10 8L0 8C0 8 0 0 0 0Z"
                            fill="#FAD02C"
                        />
                        <path
                            d="M0 0C0 0 10 8 10 8L0 8C0 8 0 0 0 0Z"
                            fill="#000000"
                            transform="translate(10 0)"
                        />
                        <path
                            d="M0 0C0 0 10 8 10 8L0 8C0 8 0 0 0 0Z"
                            fill="#FAD02C"
                            transform="translate(20 0)"
                        />
                        <rect
                            width={30}
                            height={8}
                            fill="#1A1F26"
                            fillRule="evenodd"
                            transform="translate(0 92)"
                        />
                        <path
                            d="M0 8C0 8 10 0 10 0L0 0C0 0 0 8 0 8Z"
                            fill="#FAD02C"
                            transform="translate(0 92)"
                        />
                        <path
                            d="M0 8C0 8 10 0 10 0L0 0C0 0 0 8 0 8Z"
                            fill="#000000"
                            transform="translate(10 92)"
                        />
                        <path
                            d="M0 8C0 8 10 0 10 0L0 0C0 0 0 8 0 8Z"
                            fill="#FAD02C"
                            transform="translate(20 92)"
                        />
                    </g>
                    <g transform="translate(50 8)">
                        <path
                            d="M0 0L0 84"
                            fill="none"
                            strokeWidth={10}
                            stroke="#1F2937"
                            strokeLinecap="round"
                        />
                        <path
                            d="M0 0L0 84"
                            fill="none"
                            strokeWidth={4}
                            stroke="#00F0FF"
                            strokeOpacity={0.7}
                            strokeLinecap="round"
                            filter="url(#filter_glow_pulse)"
                        />
                    </g>
                    <g transform={'translate(50 50)'}>
                        {distance <= 1 && gamePhase === "ROTATE"?<animated.g style={tileRotate}><RotateIcon/></animated.g>:""}
                    </g>
                </g>
            </animated.g>
        </g>
    )
};

export default SpaseTileBlocking;
