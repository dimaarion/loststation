import Treasures from "./Treasures.jsx";
import {useSpring, animated} from "@react-spring/web";
import {RotateIcon} from "./Objects.jsx";
import useStore from "../store.js";

export default function SpaceTileStraight({ angle = 0, translate = {x:0,y:0}, treasure = null, onClick, player }){
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
        <g transform={`translate(${translate.x}, ${translate.y})`} onClick={()=>onClick(translate.x / 100, translate.y / 100)}>
            <animated.g transform={rotation.to(r => `rotate(${r}, 50, 50)`)}>
            {/* 1. Массивный металлический корпус (Стены/Основа отсека) */}
            <rect width="100" height="100" fill="#1F242D" stroke="#11141A" strokeWidth="2"/>

            {/* Технологическая рельефная обшивка на стенах слева и справа */}
            <rect x="4" y="0" width="10" height="100" fill="#2B323D" opacity="0.4"/>
            <rect x="86" y="0" width="10" height="100" fill="#2B323D" opacity="0.4"/>

            {/* Декоративные болты/заклепки на обшивке */}
            <circle cx="9" cy="15" r="1.5" fill="#11141A" />
            <circle cx="9" cy="50" r="1.5" fill="#11141A" />
            <circle cx="9" cy="85" r="1.5" fill="#11141A" />
            <circle cx="91" cy="15" r="1.5" fill="#11141A" />
            <circle cx="91" cy="50" r="1.5" fill="#11141A" />
            <circle cx="91" cy="85" r="1.5" fill="#11141A" />

            {/* 2. Коридорная зона (Пол отсека, открытый для прохода по вертикали) */}
            <rect x="30" y="0" width="40" height="100" fill="#3A4250" />

            {/* Металлическая рифленая текстура пола (полосы заземления) */}
            <line x1="30" y1="20" x2="70" y2="20" stroke="#232934" strokeWidth="2" />
            <line x1="30" y1="40" x2="70" y2="40" stroke="#232934" strokeWidth="2" />
            <line x1="30" y1="60" x2="70" y2="60" stroke="#232934" strokeWidth="2" />
            <line x1="30" y1="80" x2="70" y2="80" stroke="#232934" strokeWidth="2" />

            {/* Центральный неоновый кабель питания (светодиодная направляющая) */}
            <line
                x1="50" y1="0"
                x2="50" y2="100"
                stroke="#00F0FF"
                strokeWidth="2"
                strokeDasharray="5 5"
                opacity="0.8"
            />

            {/* 3. Магнитные шлюзы на стыках (Верхний и Нижний выходы) */}
            {/* Желто-черная предупреждающая маркировка */}
            <g opacity="0.9">
                {/* Верхний шлюз */}
                <rect x="30" y="0" width="40" height="4" fill="#E2B842" />
                <line x1="35" y1="0" x2="40" y2="4" stroke="#11141A" strokeWidth="2" />
                <line x1="45" y1="0" x2="50" y2="4" stroke="#11141A" strokeWidth="2" />
                <line x1="55" y1="0" x2="60" y2="4" stroke="#11141A" strokeWidth="2" />
                <line x1="65" y1="0" x2="70" y2="4" stroke="#11141A" strokeWidth="2" />

                {/* Нижний шлюз */}
                <rect x="30" y="96" width="40" height="4" fill="#E2B842" />
                <line x1="35" y1="96" x2="40" y2="100" stroke="#11141A" strokeWidth="2" />
                <line x1="45" y1="96" x2="50" y2="100" stroke="#11141A" strokeWidth="2" />
                <line x1="55" y1="96" x2="60" y2="100" stroke="#11141A" strokeWidth="2" />
                <line x1="65" y1="96" x2="70" y2="100" stroke="#11141A" strokeWidth="2" />
            </g>

            {/* 4. Отрендерить сокровище по центру, если оно передано */}
                <g transform={'translate(50 50)'}>
                    {distance <= 1 && gamePhase === "ROTATE"?<animated.g style={tileRotate}><RotateIcon/></animated.g>:""}
                </g>
            <Treasures treasure={treasure}/>
            </animated.g>
        </g>
    );
};