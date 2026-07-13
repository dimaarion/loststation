

export default function SpaceTileCorner ({ rotation = 0, translate = {x:0,y:0}, treasure = null, onClick }){
    return (
        <g
            transform={`translate(${translate.x}, ${translate.y}) rotate(${rotation}, 50, 50)`}
            onClick={()=>onClick(translate.x / 100, translate.y / 100)}
            style={{ transition: 'transform 0.2s ease-in-out' }}
        >
            {/* 1. Массивный металлический корпус (Стены/Основа отсека) */}
            <rect width="100" height="100" fill="#1F242D" stroke="#11141A" strokeWidth="2" />

            {/* Внешний угол стены (глухая непроходимая зона слева-вверху) */}
            {/* Рисуем внутренний рельеф для глухой стены */}
            <path d="M 0,0 L 100,0 L 100,30 L 30,30 L 30,100 L 0,100 Z" fill="#232934" opacity="0.6" />

            {/* Технологическая металлическая накладка во внутреннем углу стен */}
            <path d="M 5,5 L 85,5 L 85,15 L 15,15 L 15,85 L 5,85 Z" fill="#2B323D" opacity="0.4" />

            {/* Заклепки на стенах */}
            <circle cx="10" cy="25" r="1.5" fill="#11141A" />
            <circle cx="25" cy="10" r="1.5" fill="#11141A" />
            <circle cx="75" cy="10" r="1.5" fill="#11141A" />
            <circle cx="10" cy="75" r="1.5" fill="#11141A" />

            {/* 2. Коридорная зона (Пол отсека, поворачивающий снизу направо) */}
            {/* Отрисовка геометрии пола при помощи плавного пути */}
            <path
                d="M 30,100 L 30,30 L 100,30 L 100,70 L 70,70 L 70,100 Z"
                fill="#3A4250"
            />

            {/* Текстура рифленого пола (линии заземления на повороте) */}
            <path d="M 30,80 L 70,80" stroke="#232934" strokeWidth="2" />
            <path d="M 30,60 L 50,60 A 20 20 0 0 1 70,40 L 100,40" stroke="#232934" strokeWidth="2" fill="none" />
            <path d="M 40,30 L 40,50" stroke="#232934" strokeWidth="2" />
            <path d="M 60,30 L 60,70" stroke="#232934" strokeWidth="2" />

            {/* Центральный неоновый кабель питания (дуговой поворот неона) */}
            <g>
                <line x1="50" y1="90" x2="50" y2="50" fill="none" strokeWidth="2" stroke="#00F0FF" strokeOpacity="0.8" strokeDasharray="5 5"  />
                <line x1="50" y1="100" x2="50" y2="50" fill="none" strokeWidth="2" stroke="#00F0FF" strokeOpacity="0.8" strokeDasharray="5 5" transform={'rotate(90, 75, 75)'}  />
            </g>


            {/* 3. Магнитные шлюзы на стыках (Нижний и Правый выходы) */}
            <g opacity="0.9">
                {/* Нижний шлюз */}
                <rect x="30" y="96" width="40" height="4" fill="#E2B842" />
                <line x1="35" y1="96" x2="40" y2="100" stroke="#11141A" strokeWidth="2" />
                <line x1="45" y1="96" x2="50" y2="100" stroke="#11141A" strokeWidth="2" />
                <line x1="55" y1="96" x2="60" y2="100" stroke="#11141A" strokeWidth="2" />
                <line x1="65" y1="96" x2="70" y2="100" stroke="#11141A" strokeWidth="2" />

                {/* Правый шлюз */}
                <rect x="96" y="30" width="4" height="40" fill="#E2B842" />
                <line x1="96" y1="35" x2="100" y2="40" stroke="#11141A" strokeWidth="2" />
                <line x1="96" y1="45" x2="100" y2="50" stroke="#11141A" strokeWidth="2" />
                <line x1="96" y1="55" x2="100" y2="60" stroke="#11141A" strokeWidth="2" />
                <line x1="96" y1="65" x2="100" y2="70" stroke="#11141A" strokeWidth="2" />
            </g>

            {/* Внутренний крошечный угол стены (справа-снизу) */}
            <path d="M 100,70 L 70,70 L 70,100 L 100,100 Z" fill="#232934" opacity="0.6" />

            {/* 4. Отрендерить сокровище (смещено ближе к центру поворота [60, 60]) */}
            {treasure && (
                <g transform="translate(55, 55)">
                    {treasure === 'energy_core' && (
                        <g>
                            <rect x="-8" y="-12" width="16" height="24" rx="4" fill="#2D3748" stroke="#FFD700" strokeWidth="1.5" />
                            <rect x="-5" y="-8" width="10" height="16" rx="2" fill="#00FF88" opacity="0.8" />
                        </g>
                    )}
                    {treasure === 'data_pad' && (
                        <g>
                            <rect x="-11" y="-14" width="22" height="28" rx="2" fill="#FFD700" />
                            <rect x="-8" y="-11" width="16" height="20" fill="#1A202C" />
                            <line x1="-5" y1="-6" x2="5" y2="-6" stroke="#00F0FF" strokeWidth="1" />
                            <line x1="-5" y1="-2" x2="2" y2="-2" stroke="#00F0FF" strokeWidth="1" />
                            <line x1="-5" y1="2" x2="5" y2="2" stroke="#00F0FF" strokeWidth="1" />
                        </g>
                    )}
                </g>
            )}
        </g>
    );
};