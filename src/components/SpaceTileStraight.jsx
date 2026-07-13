export default function SpaceTileStraight({ rotation = 0, translate = {x:0,y:0}, treasure = null, onClick }){
    return (
        <g

            transform={`translate(${translate.x}, ${translate.y}) rotate(${rotation}, 50, 50)`}
            onClick={()=>onClick(translate.x / 100, translate.y / 100)}
            style={{ transition: 'transform 0.2s ease-in-out' }}
        >
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
            {treasure && (
                <g transform="translate(50, 50)">
                    {treasure === 'energy_core' && (
                        /* Энергоядро: Капсула со светящейся плазмой */
                        <g>
                            <rect x="-8" y="-12" width="16" height="24" rx="4" fill="#2D3748" stroke="#FFD700" strokeWidth="1.5" />
                            <rect x="-5" y="-8" width="10" height="16" rx="2" fill="#00FF88" opacity="0.8" className="pulse" />
                        </g>
                    )}
                    {treasure === 'data_pad' && (
                        /* Инфопланшет: Квадратный гаджет */
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