
import {useSpring, animated} from '@react-spring/web';

export const DroidSprite = ({ x = 0, y = 0, tileSize = 100,color = '#00F0FF', name="", treasure = 0, type = "base"  }) => {
    // Пружина рассчитывает физические координаты на основе сетки
    const position = useSpring({
        transform: `translate(${x * tileSize}px, ${y * tileSize}px)`,
        config: {
            tension: 210,
            friction: 20 // Мягкое, контролируемое скольжение без лишней тряски
        }
    });

    return (
        <animated.g style={position}>
           <SpaceDroidToken type={type} treasure={treasure} color={color} name={name} />
        </animated.g>
    );
};

export const SpaceDroidToken = ({ color = '#00F0FF', name="", treasure = 0, type = "base" }) => {
    switch (type) {
        case "II-88":
            return <svg x={10} width="80" height="80" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>

                    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="1.8" result="blur"/>
                        <feFlood floodColor={color} floodOpacity="0.8" result="glowColor"/>
                        <feComposite in="glowColor" in2="blur" operator="in" result="softGlow"/>
                        <feMerge>
                            <feMergeNode in="softGlow"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>


                    <linearGradient id="droidArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3A404A"/>
                        <stop offset="50%" stopColor="#242830"/>
                        <stop offset="100%" stopColor="#15181C"/>
                    </linearGradient>
                </defs>


                <g filter="url(#neonGlow)">

                    <path d="M15 15 H5 V35" stroke={color} strokeWidth="1" fill="none" opacity="0.7"/>

                    <path d="M105 15 H115 V35" stroke={color} strokeWidth="1" fill="none" opacity="0.7"/>


                    <text x="60" y="24" fill="#FFFFFF" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                        {name}
                    </text>

                    <g transform={`translate(-25 0)`}>
                         <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={color} opacity="0.9"/>
                         <text x="54" y="42" fill={color} fontFamily="monospace" fontSize="15" fontWeight="bold">
                            {treasure}
                        </text>
                    </g>

                </g>


                <g transform="translate(0, 5)">

                    <g stroke="#15181C" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M48 72 L40 60" />
                        <circle cx="40" cy="60" r="1.5" fill={color} filter="url(#neonGlow)"/>

                        <path d="M72 72 L80 60" />
                        <circle cx="80" cy="60" r="1.5" fill={color} filter="url(#neonGlow)"/>
                    </g>


                    <g stroke="#15181C" strokeWidth="2">

                        <path d="M38 86 C30 86, 30 94, 38 94 Z" fill="url(#droidArmor)" />
                        <line x1="28" y1="88" x2="28" y2="92" stroke={color} filter="url(#neonGlow)" strokeWidth="1"/>


                        <path d="M82 86 C90 86, 90 94, 82 94 Z" fill="url(#droidArmor)" />
                        <line x1="92" y1="88" x2="92" y2="92" stroke={color} filter="url(#neonGlow)" strokeWidth="1"/>
                    </g>


                    <circle cx="60" cy="90" r="22" fill="url(#droidArmor)" stroke="#15181C" strokeWidth="2"/>

                    <path d="M41 82 C46 74, 74 74, 79 82" stroke="#15181C" strokeWidth="1.5" fill="none" opacity="0.4"/>
                    <path d="M41 98 C46 106, 74 106, 79 98" stroke="#15181C" strokeWidth="1.5" fill="none" opacity="0.4"/>


                    <g filter="url(#neonGlow)">
                        <circle cx="60" cy="90" r="11" fill="#101216" stroke={color} strokeWidth="1"/>
                        <circle cx="60" cy="90" r="6" fill={color} opacity="0.7"/>
                        <circle cx="58" cy="88" r="2" fill="#FFFFFF"/>
                    </g>


                    <g filter="url(#neonGlow)">
                        <line x1="52" y1="120" x2="68" y2="120" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                        <line x1="55" y1="125" x2="65" y2="125" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                    </g>
                </g>
            </svg>
        case "base":
            return  <g transform="translate(50, 50)">
                {/* Тень под дроидом для объема */}
                <circle cx="0" cy="4" r="18" fill="#000" opacity="0.4" />

                {/* Механический корпус дроида */}
                <circle cx="0" cy="0" r="18" fill="#2D3748" stroke="#4A5568" strokeWidth="2" />
                <circle cx="0" cy="0" r="14" fill="#1A202C" stroke="#2D3748" strokeWidth="1" />

                {/* Внешние технические пазы/шасси (4 симметричных элемента) */}
                <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(0)" />
                <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(90)" />
                <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(180)" />
                <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(270)" />

                {/* Центральный светящийся фотонный глаз/локатор */}
                <circle cx="0" cy="0" r="6" fill={color} opacity="0.3" />
                <circle cx="0" cy="0" r="4" fill="#FFF" />

                {/* Направление взгляда (маленькая неоновая точка-антенна впереди) */}
                <circle cx="0" cy="-10" r="2" fill={color} />
                <g transform={`translate(${-(name.length / 2) * 4} -30)`}>
                    <text  fill={"white"} fontSize={10}>{name}</text>
                    <text x={6} y={10}  fill={"white"} fontSize={15}>{treasure}</text>
                </g>
            </g>
        case "CRAB-M":
            return <g transform="translate(18, 0)"><HeavyDroid color={color}  size={80} name={name} counter={treasure}/></g>
        default:
            return (
                <g transform="translate(50, 50)">
                    {/* Тень под дроидом для объема */}
                    <circle cx="0" cy="4" r="18" fill="#000" opacity="0.4" />

                    {/* Механический корпус дроида */}
                    <circle cx="0" cy="0" r="18" fill="#2D3748" stroke="#4A5568" strokeWidth="2" />
                    <circle cx="0" cy="0" r="14" fill="#1A202C" stroke="#2D3748" strokeWidth="1" />

                    {/* Внешние технические пазы/шасси (4 симметричных элемента) */}
                    <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(0)" />
                    <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(90)" />
                    <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(180)" />
                    <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(270)" />

                    {/* Центральный светящийся фотонный глаз/локатор */}
                    <circle cx="0" cy="0" r="6" fill={color} opacity="0.3" />
                    <circle cx="0" cy="0" r="4" fill="#FFF" />

                    {/* Направление взгляда (маленькая неоновая точка-антенна впереди) */}
                    <circle cx="0" cy="-10" r="2" fill={color} />
                    <g transform={`translate(${-(name.length / 2) * 4} -30)`}>
                        <text  fill={"white"} fontSize={10}>{name}</text>
                        <text x={6} y={10}  fill={"white"} fontSize={15}>{treasure}</text>
                    </g>
                </g>

            );

    }


};


export const HeavyDroid = ({ name = "CRAB-M", counter = 0, size = 150, color = "#FF9900" }) => (
    <svg
        width={size * 0.8}
        height={size}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            {/* Промышленное оранжевое свечение */}
            <filter id="amberGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feFlood floodColor={color} floodOpacity="0.8" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            {/* Тяжёлая изношенная броня */}
            <linearGradient id="heavyArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A525A" />
                <stop offset="50%" stopColor="#2E333A" />
                <stop offset="100%" stopColor="#1A1D21" />
            </linearGradient>
        </defs>

        {/* ВЕРХНИЙ ИНТЕРФЕЙС (ИМЯ И СЧЕТЧИК) */}
        <g filter="url(#amberGlow)">
            <path d="M20 15 H5 V30" stroke={color} strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M100 15 H115 V30" stroke={color} strokeWidth="1.2" fill="none" opacity="0.7" />

            <text
                x="60"
                y="24"
                fill="#FFFFFF"
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="0.5"
            >
                {name}
            </text>
<g transform={"translate(-23 0)"}>
    <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={color} opacity="0.9" />
    <text x="54" y="42" fill={color} fontFamily="monospace" fontSize="15" fontWeight="bold">
        {counter}
    </text>
</g>

        </g>

        {/* ТЯЖЕЛЫЙ ДРОИД */}
        <g transform="translate(0, 10)">
            {/* ГИДРАВЛИЧЕСКИЕ ОПОРЫ */}
            <g stroke="#1A1D21" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M40 95 L22 105 L15 125" />
                <path d="M10 125 H20" strokeWidth="2" />
                <path d="M80 95 L98 105 L105 125" />
                <path d="M100 125 H110" strokeWidth="2" />
            </g>

            {/* КЛЕШНИ-МАНИПУЛЯТОРЫ */}
            <g stroke="#1A1D21" strokeWidth="2" fill="url(#heavyArmor)">
                <path d="M30 85 Q10 80, 12 65 Q25 70, 32 80 Z" />
                <path d="M90 85 Q110 80, 108 65 Q95 70, 88 80 Z" />
            </g>

            {/* ОСНОВНОЙ КОРПУС */}
            <path
                d="M35 70 L60 60 L85 70 L90 95 L60 105 L30 95 Z"
                fill="url(#heavyArmor)"
                stroke="#1A1D21"
                strokeWidth="2.5"
            />

            {/* Износ и предупреждающие полосы */}
            <path
                d="M38 90 L45 97 M48 91 L55 98 M72 97 L79 90"
                stroke={color}
                strokeWidth="1.5"
                opacity="0.4"
                strokeLinecap="round"
            />

            {/* Сенсорный визор */}
            <g filter="url(#amberGlow)">
                <rect x="42" y="73" width="36" height="8" rx="2" fill="#101216" stroke={color} strokeWidth="1" />
                <rect x="52" y="76" width="16" height="2" rx="1" fill={color} />
            </g>

            {/* Прожектор */}
            <circle cx="60" cy="93" r="3" fill="#FFE680" filter="url(#amberGlow)" />
        </g>
    </svg>
);





