import Treasures from "./Treasures.jsx";

export default function SpaceTileTShape ({ rotation = 0, translate = {x:0,y:0}, treasure = null, onClick }){
    return (
        <g
            transform={`translate(${translate.x}, ${translate.y}) rotate(${rotation}, 50, 50)`}
            onClick={()=>onClick(translate.x / 100, translate.y / 100)}
            style={{ transition: 'transform 0.2s ease-in-out' }}
        >
            {/* 1. Массивный металлический корпус (Стены/Основа отсека) */}
            <rect width="100" height="100" fill="#1F242D" stroke="#11141A" strokeWidth="2" />

            {/* Глухая стена (направление Bottom по умолчанию [Y=100]) */}
            <rect x="0" y="70" width="100" height="30" fill="#232934" opacity="0.6" />

            {/* Декоративная технологическая панель и решетка на глухой стене */}
            <rect x="10" y="80" width="80" height="10" rx="1" fill="#2B323D" opacity="0.4" />
            <line x1="15" y1="85" x2="85" y2="85" stroke="#11141A" strokeWidth="1" strokeDasharray="3 3" />

            {/* Заклепки на корпусе */}
            <circle cx="5" cy="5" r="1.5" fill="#11141A" />
            <circle cx="95" cy="5" r="1.5" fill="#11141A" />
            <circle cx="5" cy="65" r="1.5" fill="#11141A" />
            <circle cx="95" cy="65" r="1.5" fill="#11141A" />

            {/* 2. Коридорная зона (Пол отсека, Т-образный перекресток) */}
            {/* Отрисовываем Т-образную форму пола */}
            <path
                d="M 0,30 L 100,30 L 100,70 L 70,70 L 70,100 L 30,100 L 30,70 L 0,70 Z"
                fill="#3A4250"
            />

            {/* Текстура рифленого пола (линии заземления на перекрестке) */}
            <line x1="30" y1="40" x2="30" y2="60" stroke="#232934" strokeWidth="2" />
            <line x1="70" y1="40" x2="70" y2="60" stroke="#232934" strokeWidth="2" />
            <line x1="40" y1="30" x2="40" y2="70" stroke="#232934" strokeWidth="2" />
            <line x1="60" y1="30" x2="60" y2="70" stroke="#232934" strokeWidth="2" />

            {/* Декоративный восьмиугольник по центру (люк обслуживания) */}
            <polygon points="50,42 58,45 61,50 58,55 50,58 42,55 39,50 42,45" fill="#2B323D" opacity="0.4" />

            {/* Центральные неоновый кабели питания (перекресток неона) */}
            <path
                d="M 50,49 L 50,100"
                stroke="#00F0FF" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.8"
            />
            <path
                d="M 0,50 L 100,50"
                stroke="#00F0FF" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.8"
            />

            {/* 3. Магнитные шлюзы на стыках (Top, Right, Left выходы) */}
            <g opacity="0.9">
                {/* Верхний шлюз */}
                <rect x="30" y="97" width="40" height="4" fill="#E2B842" />
                <line x1="35" y1="97" x2="40" y2="100" stroke="#11141A" strokeWidth="2" />
                <line x1="45" y1="97" x2="50" y2="100" stroke="#11141A" strokeWidth="2" />
                <line x1="55" y1="97" x2="60" y2="100" stroke="#11141A" strokeWidth="2" />
                <line x1="65" y1="97" x2="70" y2="100" stroke="#11141A" strokeWidth="2" />

                {/* Правый шлюз */}
                <rect x="96" y="30" width="4" height="40" fill="#E2B842" />
                <line x1="96" y1="35" x2="100" y2="40" stroke="#11141A" strokeWidth="2" />
                <line x1="96" y1="45" x2="100" y2="50" stroke="#11141A" strokeWidth="2" />
                <line x1="96" y1="55" x2="100" y2="60" stroke="#11141A" strokeWidth="2" />
                <line x1="96" y1="65" x2="100" y2="70" stroke="#11141A" strokeWidth="2" />

                {/* Левый шлюз */}
                <rect x="0" y="30" width="4" height="40" fill="#E2B842" />
                <line x1="0" y1="35" x2="4" y2="40" stroke="#11141A" strokeWidth="2" />
                <line x1="0" y1="45" x2="4" y2="50" stroke="#11141A" strokeWidth="2" />
                <line x1="0" y1="55" x2="4" y2="60" stroke="#11141A" strokeWidth="2" />
                <line x1="0" y1="65" x2="4" y2="70" stroke="#11141A" strokeWidth="2" />
            </g>

            {/* 4. Отрендерить сокровище ровно по центру [50, 50] */}
            <Treasures treasure={treasure}/>
        </g>
    );
};