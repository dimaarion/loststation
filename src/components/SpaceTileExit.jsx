import useStore from "../store.js";
import {useSpring, animated, to} from "@react-spring/web";
import {RotateIcon} from "./Objects.jsx";
import Treasures from "./Treasures.jsx";

export const SpaceTileExit = ({tileRotate, angle = 0, translate = {x:0,y:0}, treasure = null, onClick, player }) => {

    const gamePhase = useStore((state) => state.gamePhase);
    const { rotation } = useSpring({
        rotation: angle, // Сюда передаем 0, 90, 180 или 270 градусов из стейта
        config: {
            duration:500,
        }
    });



    const distance = Math.abs(player.x - translate.x / 100) + Math.abs(player.y - translate.y / 100);

    return (
        <g transform={`translate(${translate.x}, ${translate.y})`} onClick={()=>onClick(translate.x / 100, translate.y / 100)}>

            <animated.g transform={rotation.to(r => `rotate(${r}, 50, 50)`)}>
    <g>
        <g>
            <path
                d="M0 16L0 8C0 5.79086 0.781049 3.90524 2.34315 2.34315C3.90524 0.781049 5.79086 0 8 0L92 0C94.2091 0 96.0947 0.781049 97.6568 2.34315C99.2189 3.90524 100 5.79086 100 8L100 92C100 94.2091 99.2189 96.0947 97.6568 97.6568C96.0947 99.2189 94.2091 100 92 100L8 100C5.79086 100 3.90524 99.2189 2.34315 97.6568C0.781049 96.0947 0 94.2091 0 92L0 16Z"
                fill="#161B22"
                fillRule="evenodd"
                strokeWidth="3"
                stroke="#0D1117"
            />
            <path
                d="M20 0L20 100M40 0L40 100M60 0L60 100M80 0L80 100M0 20L100 20M0 40L100 40M0 60L100 60M0 80L100 80"
                fill="none"
                strokeWidth="1"
                stroke="#0D1117"
                strokeOpacity="0.3"
            />

            <g transform={`translate(14 14)`}>
                {/*поворот 180*/}

                <path
                    d="M0 36C0 16.1177 16.1177 0 36 0C55.8822 0 72 16.1177 72 36C72 55.8822 55.8822 72 36 72C16.1177 72 0 55.8822 0 36Z"
                    fill="#1A202C"
                    fillRule="evenodd"
                    strokeWidth="3"
                    stroke="#2D3748"
                />
                <g transform="translate(16 24)">
                    <path
                        d="M0 0L40 0"
                        fill="none"
                        strokeWidth="6"
                        stroke="#FF9900"
                        strokeLinecap="round"
                        transform="translate(0 12)"
                    />
                    <path
                        d="M0 0L14 12L0 24"
                        fill="none"
                        strokeWidth="6"
                        stroke="#FF9900"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="translate(28 0)"
                    />
                </g>
                <path
                    d="M0 0L20 0"
                    fill="none"
                    strokeWidth="2"
                    stroke="#FFE600"
                    strokeOpacity="0.8"
                    transform="translate(21 36)"
                />
            </g>
            <g transform="translate(5 2)">
                <g>
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
                <g transform="translate(30 0)">
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
                <g transform="translate(60 0)">
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
            </g>
            <g transform="translate(5 90)">
                <g>
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
                <g transform="translate(30 0)">
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
                <g transform="translate(60 0)">
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
            </g>
        </g>


        {/* 4. Отрендерить сокровище (смещено ближе к центру поворота [60, 60]) */}
        <g transform={'translate(50 50)'}>

            {distance <= 1 && gamePhase === "ROTATE"?<animated.g style={tileRotate}><RotateIcon/></animated.g>:""}
        </g>
        <Treasures treasure={treasure}/>
    </g>

        </animated.g>

        </g>
    );
};

export default SpaceTileExit;