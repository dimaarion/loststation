
import {useSpring, animated} from '@react-spring/web';

export const DroidSprite = ({ x = 0, y = 0, skipMoveActive=false, tileSize = 100,color = '#00F0FF', name="", treasure = 0, type = "base"  }) => {
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
            <g>
                {skipMoveActive?<ellipse rx={20} ry={20} fill="#42C5C9" fillRule="evenodd" filter="url(#filter_active_player_1)"
                                         transform={'translate(50, 50)'}/>:""}
                <SpaceDroidToken type={type} treasure={treasure} color={color} name={name} />
            </g>

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
        case "VCTR-7":
            return <g transform="translate(2, -5)"><CyberDroid glowColor={color}  size={80} name={name} count={treasure}/></g>
        case "ANBS-3":
            return <g transform="translate(2, -5)"><MedDroid glowColor={color}  size={80} name={name} count={treasure}/></g>
        case "AEGIS-9":
            return <g transform="translate(2, -5)"><CombatDroid glowColor={color}  size={80} name={name} count={treasure}/></g>
        case "SPTR-5":
            return <g transform="translate(2, -5)"><StealthDroid glowColor={color}  size={80} name={name} count={treasure}/></g>
        case "MGMA-4":
            return <g transform="translate(2, -5)"><MagmaDroid glowColor={color}  size={80} name={name} count={treasure}/></g>
        case "COLT-8":
            return <g transform="translate(2, -5)"><ColtDroid glowColor={color}  size={80} name={name} count={treasure}/></g>
        case "WARP-6":
            return <g transform="translate(2, -5)"><WarpDroid glowColor={color}  size={80} name={name} count={treasure}/></g>
        case "FIX-0":
            return <g transform="translate(2, -5)"><FixDroid glowColor={color}  size={80} name={name} count={treasure}/></g>
        case "MULE-1":
            return <g transform="translate(2, -5)"><MuleDroid glowColor={color}  size={80} name={name} count={treasure}/></g>
        case "NEXUS-3":
            return <g transform="translate(2, -5)"><NexusDroid glowColor={color}  size={80} name={name} count={treasure}/></g>
        case "SIREN-1":
            return <g transform="translate(2, -5)"><SirenDroid glowColor={color}  size={80} name={name} count={treasure}/></g>
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

export const SirenDroid = ({
                               width = 100,
                               height = 100,
                               glowColor = "#FF66CC",
                               armorStart = "#473A4F",
                               armorMid = "#2D2531",
                               armorEnd = "#19151C",
                               textColor = "#FFFFFF",
                               name = "SIREN-1",
                               count = 0
                           }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="sirenGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feFlood floodColor={glowColor} floodOpacity="0.8" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <linearGradient id="sirenArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={armorStart} />
                <stop offset="50%" stopColor={armorMid} />
                <stop offset="100%" stopColor={armorEnd} />
            </linearGradient>
        </defs>

        {/* Верхний интерфейс */}
        <g filter="url(#sirenGlow)">
            <path d="M10 25 C10 15, 30 15, 35 15 M5 20 V30" stroke={glowColor} strokeWidth="1" fill="none" opacity="0.7" />
            <path d="M110 25 C110 15, 90 15, 85 15 M115 20 V30" stroke={glowColor} strokeWidth="1" fill="none" opacity="0.7" />

            <text
                x="60"
                y="24"
                fill={textColor}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="1"
            >
                {name}
            </text>

            <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={glowColor} opacity="0.9" />
            <text x="54" y="40" fill={glowColor} fontFamily="monospace" fontSize="9" fontWeight="bold">
                {count}
            </text>
        </g>

        {/* Основной корпус */}
        <g transform="translate(0, 0)">
            <g fill={armorEnd} stroke={armorEnd} strokeWidth="1.5">
                <path d="M40 60 C25 60, 20 75, 25 90 C30 100, 38 100, 40 98 Z" />
                <path d="M80 60 C95 60, 100 75, 95 90 C90 100, 82 100, 80 98 Z" />
            </g>

            <path
                d="M42 60 C42 60, 60 55, 78 60 C85 75, 75 110, 60 118 C45 110, 35 75, 42 60 Z"
                fill="url(#sirenArmor)"
                stroke={armorEnd}
                strokeWidth="2"
            />

            <path d="M52 65 V105 M60 62 V108 M68 65 V105" stroke={armorEnd} strokeWidth="1" opacity="0.4" />

            <g filter="url(#sirenGlow)">
                <circle cx="60" cy="80" r="12" fill={armorEnd} stroke={glowColor} strokeWidth="1.2" />
                <circle cx="60" cy="80" r="5" fill={glowColor} />
                <circle cx="57" cy="77" r="1.5" fill={textColor} />
            </g>

            <g fill={glowColor} opacity="0.8" filter="url(#sirenGlow)">
                <circle cx="36" cy="88" r="1.5" />
                <circle cx="84" cy="88" r="1.5" />
                <circle cx="60" cy="52" r="1.5" />
            </g>

            <path
                d="M48 122 C52 128, 68 128, 72 122"
                stroke={glowColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
                filter="url(#sirenGlow)"
            />
        </g>
    </svg>
);


export const NexusDroid = ({
                               width = 100,
                               height = 100,
                               glowColor = "#FFFFFF",
                               armorStart = "#3A3F47",
                               armorMid = "#22252A",
                               armorEnd = "#111317",
                               textColor = "#FFFFFF",
                               name = "NEXUS-3",
                               count = 0
                           }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="nexusGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feFlood floodColor={glowColor} floodOpacity="0.9" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <linearGradient id="nexusArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={armorStart} />
                <stop offset="50%" stopColor={armorMid} />
                <stop offset="100%" stopColor={armorEnd} />
            </linearGradient>
        </defs>

        {/* Верхний интерфейс */}
        <g filter="url(#nexusGlow)">
            <path d="M15 15 H5 V30 M5 15 L12 22" stroke={glowColor} strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M105 15 H115 V30 M115 15 L108 22" stroke={glowColor} strokeWidth="1.2" fill="none" opacity="0.8" />

            <text
                x="60"
                y="24"
                fill={textColor}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="1"
            >
                {name}
            </text>

            <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={glowColor} opacity="0.9" />
            <text x="54" y="40" fill={glowColor} fontFamily="monospace" fontSize="9" fontWeight="bold">
                {count}
            </text>
        </g>

        {/* Основной корпус */}
        <g transform="translate(0, 0)">
            <g stroke={glowColor} strokeWidth="1" opacity="0.4" filter="url(#nexusGlow)">
                <ellipse cx="60" cy="75" rx="34" ry="12" fill="none" />
                <ellipse cx="60" cy="75" rx="14" ry="32" fill="none" transform="rotate(15 60 75)" />
            </g>

            <circle cx="60" cy="75" r="18" fill="url(#nexusArmor)" stroke={armorEnd} strokeWidth="2" />
            <path d="M46 70 H74 M46 80 H74 M60 61 V89" stroke={armorEnd} strokeWidth="1.5" opacity="0.6" />

            <g filter="url(#nexusGlow)">
                <line x1="50" y1="75" x2="70" y2="75" stroke={glowColor} strokeWidth="2" strokeLinecap="round" />
                <circle cx="60" cy="67" r="1.5" fill={glowColor} />
                <circle cx="60" cy="83" r="1.5" fill={glowColor} />
            </g>

            <g fill={glowColor} filter="url(#nexusGlow)">
                <circle cx="26" cy="75" r="2" />
                <circle cx="94" cy="75" r="2" />
                <circle cx="64" cy="42" r="1.5" />
            </g>

            <path
                d="M44 114 Q60 122, 76 114"
                stroke={glowColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
                filter="url(#nexusGlow)"
            />
            <path
                d="M50 120 Q60 126, 70 120"
                stroke={glowColor}
                strokeWidth="1"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
                filter="url(#nexusGlow)"
            />
        </g>
    </svg>
);


export const MuleDroid = ({
                              width = 100,
                              height = 100,
                              glowColor = "#D2691E",
                              armorStart = "#4F4639",
                              armorMid = "#362F26",
                              armorEnd = "#1E1A14",
                              textColor = "#FFFFFF",
                              name = "MULE-1",
                              count = 0
                          }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="muleGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feFlood floodColor={glowColor} floodOpacity="0.8" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <linearGradient id="muleArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={armorStart} />
                <stop offset="50%" stopColor={armorMid} />
                <stop offset="100%" stopColor={armorEnd} />
            </linearGradient>
        </defs>

        {/* Верхний интерфейс */}
        <g filter="url(#muleGlow)">
            <path d="M15 15 H5 V25 M5 25 H15 V15" stroke={glowColor} strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M105 15 H115 V25 M115 25 H105 V15" stroke={glowColor} strokeWidth="1.2" fill="none" opacity="0.7" />

            <text
                x="60"
                y="24"
                fill={textColor}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="1"
            >
                {name}
            </text>

            <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={glowColor} opacity="0.9" />
            <text x="54" y="40" fill={glowColor} fontFamily="monospace" fontSize="9" fontWeight="bold">
                {count}
            </text>
        </g>

        {/* Основной корпус */}
        <g transform="translate(0, 0)">
            <g fill={armorEnd} stroke={glowColor} strokeWidth="1.5" filter="url(#muleGlow)">
                <path d="M30 75 Q15 75, 18 90 L22 110 H32 Z" opacity="0.5" />
                <line x1="16" y1="92" x2="16" y2="108" strokeWidth="2" />

                <path d="M90 75 Q105 75, 102 90 L98 110 H88 Z" opacity="0.5" />
                <line x1="104" y1="92" x2="104" y2="108" strokeWidth="2" />
            </g>

            <path
                d="M40 55 H80 Q90 55, 90 65 V105 H30 V65 Q30 55, 40 55 Z"
                fill="url(#muleArmor)"
                stroke={armorEnd}
                strokeWidth="2.5"
            />

            <line x1="30" y1="75" x2="90" y2="75" stroke={armorEnd} strokeWidth="1.5" opacity="0.7" />
            <line x1="30" y1="90" x2="90" y2="90" stroke={armorEnd} strokeWidth="1.5" opacity="0.7" />
            <line x1="60" y1="55" x2="60" y2="105" stroke={armorEnd} strokeWidth="2" opacity="0.6" />

            <g filter="url(#muleGlow)">
                <circle cx="50" cy="65" r="2" fill="#FF8C00" />
                <circle cx="60" cy="65" r="2" fill="#FF8C00" />
                <circle cx="70" cy="65" r="2" fill="#FF8C00" />
                <circle cx="38" cy="100" r="1.5" fill="#FF4500" opacity="0.7" />
                <circle cx="82" cy="100" r="1.5" fill="#FF4500" opacity="0.7" />
            </g>

            <g fill={armorEnd} stroke={armorEnd} strokeWidth="2">
                <circle cx="45" cy="108" r="4" />
                <path d="M42 112 Q45 118, 48 112" stroke="#FF4500" strokeWidth="1" fill="none" opacity="0.5" filter="url(#muleGlow)" />

                <circle cx="75" cy="108" r="4" />
                <path d="M72 112 Q75 118, 78 112" stroke="#FF4500" strokeWidth="1" fill="none" opacity="0.5" filter="url(#muleGlow)" />
            </g>

            <path
                d="M46 122 C52 128, 68 128, 74 122"
                stroke={glowColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
                filter="url(#muleGlow)"
            />
        </g>
    </svg>
);



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

export const CyberDroid = ({
                               width = 100,
                               height = 100,
                               glowColor = "#00FF66",
                               armorStart = "#2D3A32",
                               armorMid = "#1B241F",
                               armorEnd = "#0F1411",
                               textColor = "#FFFFFF",
                               name = "VCTR-7",
                               count = 0
                           }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="cyberGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feFlood floodColor={glowColor} floodOpacity="0.8" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <linearGradient id="cyberArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={armorStart} />
                <stop offset="50%" stopColor={armorMid} />
                <stop offset="100%" stopColor={armorEnd} />
            </linearGradient>
        </defs>

        {/* Верхний интерфейс */}
        <g filter="url(#cyberGlow)">
            <path d="M25 15 L12 23 V35" stroke={glowColor} strokeWidth="1" fill="none" opacity="0.8" />
            <path d="M95 15 L108 23 V35" stroke={glowColor} strokeWidth="1" fill="none" opacity="0.8" />

            <text
                x="60"
                y="24"
                fill={textColor}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="1"
            >
                {name}
            </text>

            <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={glowColor} opacity="0.9" />
            <text x="54" y="40" fill={glowColor} fontFamily="monospace" fontSize="9" fontWeight="bold">
                {count}
            </text>
        </g>

        {/* Основной корпус */}
        <g transform="translate(0, 0)">
            <path d="M30 65 H90 L75 105 H45 Z" fill="url(#cyberArmor)" stroke={armorEnd} strokeWidth="2" />
            <line x1="60" y1="65" x2="60" y2="105" stroke={armorEnd} strokeWidth="1.5" opacity="0.6" />

            {/* Визор */}
            <g filter="url(#cyberGlow)">
                <circle cx="60" cy="78" r="6" fill={armorEnd} stroke={glowColor} strokeWidth="1" />
                <circle cx="60" cy="78" r="3" fill={glowColor} />

                <circle cx="48" cy="82" r="3" fill={armorEnd} stroke={glowColor} strokeWidth="0.8" />
                <circle cx="48" cy="82" r="1.5" fill={glowColor} />

                <circle cx="72" cy="82" r="3" fill={armorEnd} stroke={glowColor} strokeWidth="0.8" />
                <circle cx="72" cy="82" r="1.5" fill={glowColor} />
            </g>
        </g>
    </svg>
);

export const MedDroid = ({
                             width = 100,
                             height = 100,
                             glowColor = "#D080FF",
                             armorStart = "#E2E8F0",
                             armorMid = "#94A3B8",
                             armorEnd = "#475569",
                             textColor = "#FFFFFF",
                             name = "ANBS-3",
                             count = 0
                         }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="medGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feFlood floodColor={glowColor} floodOpacity="0.5" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <linearGradient id="medArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={armorStart} />
                <stop offset="60%" stopColor={armorMid} />
                <stop offset="100%" stopColor={armorEnd} />
            </linearGradient>
        </defs>

        {/* Верхний интерфейс */}
        <g filter="url(#medGlow)">
            <path d="M10 25 C10 15, 30 15, 35 15" stroke="#E0E5FF" strokeWidth="1" fill="none" opacity="0.8" />
            <path d="M110 25 C110 15, 90 15, 85 15" stroke="#E0E5FF" strokeWidth="1" fill="none" opacity="0.8" />

            <text
                x="60"
                y="24"
                fill={textColor}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="1"
            >
                {name}
            </text>

            <path d="M42 33 L46 37 L42 41 L38 37 Z" fill="#E0E5FF" opacity="0.9" />
            <text x="54" y="40" fill="#E0E5FF" fontFamily="monospace" fontSize="9" fontWeight="bold">
                {count}
            </text>
        </g>

        {/* Основной корпус */}
        <g transform="translate(0, 0)">
            <path
                d="M42 60 C42 60, 60 55, 78 60 C82 75, 74 100, 60 112 C46 100, 38 75, 42 60 Z"
                fill="url(#medArmor)"
                stroke="#1E293B"
                strokeWidth="2"
            />

            {/* Медицинский крест */}
            <path d="M60 92 V100 M56 96 H64" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

            {/* Визор */}
            <g filter="url(#medGlow)">
                <path d="M48 70 Q54 75, 52 83" stroke="#E0E5FF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="51" cy="79" r="1.5" fill={glowColor} />

                <path d="M72 70 Q66 75, 68 83" stroke="#E0E5FF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="69" cy="79" r="1.5" fill={glowColor} />
            </g>

            {/* Стабилизаторы */}
            <g fill="url(#medArmor)" stroke="#1E293B" strokeWidth="1.5">
                <path d="M34 68 C26 68, 28 85, 36 88 Z" />
                <path d="M86 68 C94 68, 92 85, 84 88 Z" />
            </g>

            {/* Колбы */}
            <circle cx="33" cy="78" r="2" fill={glowColor} filter="url(#medGlow)" />
            <circle cx="87" cy="78" r="2" fill={glowColor} filter="url(#medGlow)" />

            {/* Репульсор */}
            <path
                d="M48 118 Q60 124, 72 118"
                stroke="#E0E5FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
                filter="url(#medGlow)"
            />
        </g>
    </svg>
);

export const CombatDroid = ({
                                width = 100,
                                height = 100,
                                glowColor = "#FF3344",
                                armorStart = "#545B66",
                                armorMid = "#343942",
                                armorEnd = "#1E2126",
                                textColor = "#FFFFFF",
                                name = "AEGIS-9",
                                count = 0
                            }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="tacticalGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feFlood floodColor={glowColor} floodOpacity="0.8" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <linearGradient id="combatArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={armorStart} />
                <stop offset="50%" stopColor={armorMid} />
                <stop offset="100%" stopColor={armorEnd} />
            </linearGradient>
        </defs>

        {/* Верхний интерфейс */}
        <g filter="url(#tacticalGlow)">
            <path d="M30 15 H5 V25 L10 35" stroke={glowColor} strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M90 15 H115 V25 L110 35" stroke={glowColor} strokeWidth="1.2" fill="none" opacity="0.8" />

            <text
                x="60"
                y="24"
                fill={textColor}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="0.5"
            >
                {name}
            </text>

            <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={glowColor} opacity="0.9" />
            <text x="54" y="40" fill={glowColor} fontFamily="monospace" fontSize="9" fontWeight="bold">
                {count}
            </text>
        </g>

        {/* Основной корпус */}
        <g transform="translate(0, 0)">
            <g stroke={armorEnd} strokeWidth="2" fill="url(#combatArmor)">
                <path d="M32 75 L16 80 L20 95 L34 90 Z" />
                <circle cx="16" cy="80" r="1.5" fill={glowColor} filter="url(#tacticalGlow)" />

                <path d="M88 75 L104 80 L100 95 L86 90 Z" />
                <circle cx="104" cy="80" r="1.5" fill={glowColor} filter="url(#tacticalGlow)" />
            </g>

            <path
                d="M60 54 L94 72 L82 110 L60 120 L38 110 L26 72 Z"
                stroke={glowColor}
                strokeWidth="1"
                strokeDasharray="4 2"
                fill="none"
                opacity="0.4"
                filter="url(#tacticalGlow)"
            />

            <path
                d="M60 58 L90 74 L80 106 L60 114 L40 106 L30 74 Z"
                fill="url(#combatArmor)"
                stroke={armorEnd}
                strokeWidth="2.5"
            />

            <path d="M48 68 L60 76 L72 68" stroke={armorEnd} strokeWidth="2" fill="none" opacity="0.6" />

            <g filter="url(#tacticalGlow)">
                <rect x="46" y="82" width="28" height="5" rx="1" fill="#101216" stroke={glowColor} strokeWidth="1" />
                <circle cx="54" cy="84.5" r="1.5" fill={glowColor} />
                <circle cx="66" cy="84.5" r="1.5" fill={glowColor} />
            </g>

            <g stroke={armorEnd} strokeWidth="2" fill="#101216">
                <rect x="56" y="112" width="8" height="10" rx="1" />
                <line x1="60" y1="122" x2="60" y2="127" stroke={glowColor} strokeWidth="1.5" filter="url(#tacticalGlow)" />
            </g>

            <path
                d="M46 112 Q60 118, 74 112"
                stroke={glowColor}
                strokeWidth="1"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
                filter="url(#tacticalGlow)"
            />
        </g>
    </svg>
);

export const StealthDroid = ({
                                 width = 100,
                                 height = 100,
                                 glowColor = "#3344FF",
                                 armorStart = "#252A34",
                                 armorMid = "#181B22",
                                 armorEnd = "#0D0F14",
                                 textColor = "#FFFFFF",
                                 name = "SPTR-5",
                                 count = 0
                             }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="stealthGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feFlood floodColor={glowColor} floodOpacity="0.9" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <linearGradient id="stealthArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={armorStart} />
                <stop offset="50%" stopColor={armorMid} />
                <stop offset="100%" stopColor={armorEnd} />
            </linearGradient>
        </defs>

        {/* Верхний интерфейс */}
        <g filter="url(#stealthGlow)">
            <path d="M10 18 H25 L30 25" stroke={glowColor} strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M110 18 H95 L90 25" stroke={glowColor} strokeWidth="1" fill="none" opacity="0.6" />

            <text
                x="60"
                y="24"
                fill={textColor}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="1"
            >
                {name}
            </text>

            <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={glowColor} opacity="0.9" />
            <text x="54" y="40" fill={glowColor} fontFamily="monospace" fontSize="9" fontWeight="bold">
                {count}
            </text>
        </g>

        {/* Основной корпус */}
        <g transform="translate(0, 0)">
            <g stroke={glowColor} strokeWidth="1" opacity="0.5" filter="url(#stealthGlow)">
                <line x1="38" y1="65" x2="22" y2="50" />
                <line x1="18" y1="52" x2="22" y2="50" />
                <line x1="82" y1="65" x2="98" y2="50" />
                <line x1="102" y1="52" x2="98" y2="50" />
            </g>

            <path
                d="M60 55 L90 75 L60 115 L30 75 Z"
                fill="url(#stealthArmor)"
                stroke={armorEnd}
                strokeWidth="2"
            />
            <path d="M30 75 H90 M60 55 V115" stroke={armorEnd} strokeWidth="1" opacity="0.7" />

            <g filter="url(#stealthGlow)">
                <path d="M46 74 L60 80 L74 74" stroke={glowColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="50" cy="84" r="1.5" fill={glowColor} />
                <circle cx="70" cy="84" r="1.5" fill={glowColor} />
            </g>

            <g fill={armorEnd} stroke={glowColor} strokeWidth="1" filter="url(#stealthGlow)">
                <circle cx="60" cy="100" r="4" fill={armorEnd} strokeWidth="1.5" />
                <circle cx="60" cy="100" r="1" fill={textColor} />
            </g>

            <path d="M50 122 H70" stroke={glowColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" filter="url(#stealthGlow)" />
            <path d="M54 126 H66" stroke={glowColor} strokeWidth="1" strokeLinecap="round" opacity="0.3" filter="url(#stealthGlow)" />
        </g>
    </svg>
);

export const MagmaDroid = ({
                               width = 100,
                               height = 100,
                               glowColor = "#FFDD00",
                               armorStart = "#5C4033",
                               armorMid = "#3D2B22",
                               armorEnd = "#1F140E",
                               textColor = "#FFFFFF",
                               name = "MGMA-4",
                               count = 0
                           }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="magmaGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feFlood floodColor={glowColor} floodOpacity="0.8" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <linearGradient id="magmaArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={armorStart} />
                <stop offset="50%" stopColor={armorMid} />
                <stop offset="100%" stopColor={armorEnd} />
            </linearGradient>
        </defs>

        {/* Верхний интерфейс */}
        <g filter="url(#magmaGlow)">
            <path d="M15 15 H5 V28 L18 35" stroke={glowColor} strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M105 15 H115 V28 L102 35" stroke={glowColor} strokeWidth="1.2" fill="none" opacity="0.8" />

            <text
                x="60"
                y="24"
                fill={textColor}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="0.5"
            >
                {name}
            </text>

            <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={glowColor} opacity="0.9" />
            <text x="54" y="40" fill={glowColor} fontFamily="monospace" fontSize="9" fontWeight="bold">
                {count}
            </text>
        </g>

        {/* Основной корпус */}
        <g transform="translate(0, 0)">
            <g fill={armorEnd} stroke={glowColor} strokeWidth="1" filter="url(#magmaGlow)">
                <path d="M32 70 L20 74 L22 84 L32 80 Z" opacity="0.5" />
                <line x1="18" y1="76" x2="18" y2="82" strokeWidth="1.5" />

                <path d="M88 70 L100 74 L98 84 L88 80 Z" opacity="0.5" />
                <line x1="102" y1="76" x2="102" y2="82" strokeWidth="1.5" />
            </g>

            <path
                d="M60 55 L86 70 L76 105 L60 118 L44 105 L34 70 Z"
                fill="url(#magmaArmor)"
                stroke={armorEnd}
                strokeWidth="2.5"
            />

            <path d="M37 78 H83 M41 92 H79 M44 105 H76" stroke={armorEnd} strokeWidth="1.5" opacity="0.7" />

            <g filter="url(#magmaGlow)">
                <circle cx="60" cy="74" r="7" fill={armorEnd} stroke={glowColor} strokeWidth="1.2" />
                <circle cx="60" cy="74" r="3" fill={glowColor} />
            </g>

            <g filter="url(#magmaGlow)">
                <path d="M56 115 L60 126 L64 115 Z" fill={glowColor} />
                <path d="M50 110 Q60 114, 70 110" stroke={glowColor} strokeWidth="1" fill="none" opacity="0.4" />
            </g>

            <path
                d="M46 128 C52 133, 68 133, 74 128"
                stroke={glowColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
                filter="url(#magmaGlow)"
            />
        </g>
    </svg>
);

export const ColtDroid = ({
                              width = 100,
                              height = 100,
                              glowColor = "#9900FF",
                              armorStart = "#403A47",
                              armorMid = "#242029",
                              armorEnd = "#141117",
                              textColor = "#FFFFFF",
                              name = "COLT-8",
                              count = 0
                          }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="coltGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feFlood floodColor={glowColor} floodOpacity="0.8" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <linearGradient id="gunmetalArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={armorStart} />
                <stop offset="50%" stopColor={armorMid} />
                <stop offset="100%" stopColor={armorEnd} />
            </linearGradient>
        </defs>

        {/* Верхний интерфейс */}
        <g filter="url(#coltGlow)">
            <path d="M12 15 H5 V30 L20 35" stroke={glowColor} strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M108 15 H115 V30 L100 35" stroke={glowColor} strokeWidth="1.2" fill="none" opacity="0.8" />

            <text
                x="60"
                y="24"
                fill={textColor}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="1"
            >
                {name}
            </text>

            <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={glowColor} opacity="0.9" />
            <text x="54" y="40" fill={glowColor} fontFamily="monospace" fontSize="9" fontWeight="bold">
                {count}
            </text>
        </g>

        {/* Основной корпус */}
        <g transform="translate(0, 0)">
            <g fill={armorEnd} stroke={glowColor} strokeWidth="1" opacity="0.6" filter="url(#coltGlow)">
                <path d="M30 65 L15 60 L18 72 Z" />
                <path d="M90 65 L105 60 L102 72 Z" />
            </g>

            <path
                d="M40 55 H80 L88 75 L80 110 H40 L32 75 Z"
                fill="url(#gunmetalArmor)"
                stroke={armorEnd}
                strokeWidth="2.5"
            />

            <rect x="44" y="65" width="6" height="30" rx="2" fill={armorEnd} opacity="0.8" />
            <rect x="57" y="65" width="6" height="30" rx="2" fill={armorEnd} opacity="0.8" />
            <rect x="70" y="65" width="6" height="30" rx="2" fill={armorEnd} opacity="0.8" />

            <g filter="url(#coltGlow)">
                <rect x="51" y="72" width="18" height="12" rx="1" fill={armorEnd} stroke={glowColor} strokeWidth="1.2" />
                <line x1="60" y1="74" x2="60" y2="82" stroke={glowColor} strokeWidth="2" />
            </g>

            <g stroke={armorEnd} strokeWidth="2" fill={armorEnd}>
                <rect x="45" y="110" width="8" height="14" rx="1" />
                <circle cx="49" cy="124" r="1.5" fill={glowColor} filter="url(#coltGlow)" />

                <rect x="67" y="110" width="8" height="14" rx="1" />
                <circle cx="71" cy="124" r="1.5" fill={glowColor} filter="url(#coltGlow)" />
            </g>

            <path
                d="M48 114 Q60 120, 72 114"
                stroke={glowColor}
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                filter="url(#coltGlow)"
            />
        </g>
    </svg>
);

export const WarpDroid = ({
                              width = 100,
                              height = 100,
                              glowColor = "#00E6A4",
                              armorStart = "#334D46",
                              armorMid = "#1F2E2A",
                              armorEnd = "#121B19",
                              textColor = "#FFFFFF",
                              name = "WARP-6",
                              count = 0
                          }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="warpGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feFlood floodColor={glowColor} floodOpacity="0.8" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <linearGradient id="stealthArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={armorStart} />
                <stop offset="50%" stopColor={armorMid} />
                <stop offset="100%" stopColor={armorEnd} />
            </linearGradient>
        </defs>

        {/* Верхний интерфейс */}
        <g filter="url(#warpGlow)">
            <path d="M20 15 L5 20 V35" stroke={glowColor} strokeWidth="1" fill="none" opacity="0.7" />
            <path d="M100 15 L115 20 V35" stroke={glowColor} strokeWidth="1" fill="none" opacity="0.7" />

            <text
                x="60"
                y="24"
                fill={textColor}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="1"
            >
                {name}
            </text>

            <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={glowColor} opacity="0.9" />
            <text x="54" y="40" fill={glowColor} fontFamily="monospace" fontSize="9" fontWeight="bold">
                {count}
            </text>
        </g>

        {/* Основной корпус */}
        <g transform="translate(0, 0)">
            <g fill={armorEnd} stroke={glowColor} strokeWidth="1.2" filter="url(#warpGlow)">
                <path d="M36 65 Q25 65, 26 75 C26 85, 30 85, 36 85 Z" opacity="0.6" />
                <path d="M84 65 Q95 65, 94 75 C94 85, 90 85, 84 85 Z" opacity="0.6" />
            </g>

            <circle cx="60" cy="75" r="25" fill="url(#stealthArmor)" stroke={armorEnd} strokeWidth="2.5" />
            <path d="M38 65 L82 85 M38 85 L82 65" stroke={armorEnd} strokeWidth="1.5" opacity="0.5" />

            <g filter="url(#warpGlow)">
                <circle cx="60" cy="75" r="10" fill={armorEnd} stroke={glowColor} strokeWidth="1.5" />
                <line x1="56" y1="75" x2="64" y2="75" stroke={glowColor} strokeWidth="1" />
                <line x1="60" y1="71" x2="60" y2="79" stroke={glowColor} strokeWidth="1" />
            </g>

            <circle cx="52" cy="85" r="2" fill={glowColor} filter="url(#warpGlow)" />
            <circle cx="68" cy="85" r="2" fill={glowColor} filter="url(#warpGlow)" />

            <g stroke={armorEnd} strokeWidth="2.5" fill="url(#stealthArmor)" strokeLinejoin="round">
                <path d="M48 98 C38 108, 82 108, 72 98 Z" />
                <path d="M60 106 L60 115" strokeLinecap="round" />
            </g>

            <path
                d="M50 115 Q60 120, 70 115"
                stroke={glowColor}
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                filter="url(#warpGlow)"
            />
        </g>
    </svg>
);


export const FixDroid = ({
                             width = 100,
                             height = 100,
                             glowColor = "#FFBF00",
                             armorStart = "#5C5445",
                             armorMid = "#3D382E",
                             armorEnd = "#1F1D17",
                             textColor = "#FFFFFF",
                             name = "FIX-0",
                             count = 0
                         }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="fixGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feFlood floodColor={glowColor} floodOpacity="0.8" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                <feMerge>
                    <feMergeNode in="softGlow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <linearGradient id="fixArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={armorStart} />
                <stop offset="50%" stopColor={armorMid} />
                <stop offset="100%" stopColor={armorEnd} />
            </linearGradient>
        </defs>

        {/* Верхний интерфейс */}
        <g filter="url(#fixGlow)">
            <path d="M15 15 H5 V25 L15 35 V25" stroke={glowColor} strokeWidth="1" fill="none" opacity="0.7" />
            <path d="M105 15 H115 V25 L105 35 V25" stroke={glowColor} strokeWidth="1" fill="none" opacity="0.7" />

            <text
                x="60"
                y="24"
                fill={textColor}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="1"
            >
                {name}
            </text>

            <path d="M42 33 L46 37 L42 41 L38 37 Z" fill={glowColor} opacity="0.9" />
            <text x="54" y="40" fill={glowColor} fontFamily="monospace" fontSize="9" fontWeight="bold">
                {count}
            </text>
        </g>

        {/* Основной корпус */}
        <g transform="translate(0, 0)">
            <g stroke={armorEnd} strokeWidth="1.5" fill="none">
                <path d="M35 75 L15 70 L10 80 V90" strokeLinejoin="round" />
                <circle cx="10" cy="90" r="1.5" fill={glowColor} filter="url(#fixGlow)" />

                <path d="M85 75 L105 70 L110 80 L110 100" strokeLinejoin="round" />
                <line x1="110" y1="100" x2="110" y2="108" stroke={glowColor} filter="url(#fixGlow)" />
            </g>

            <path
                d="M30 60 H90 L85 110 H35 Z"
                fill="url(#fixArmor)"
                stroke={armorEnd}
                strokeWidth="2.5"
            />

            <line x1="45" y1="60" x2="48" y2="110" stroke={armorEnd} strokeWidth="1.5" opacity="0.7" />
            <line x1="60" y1="60" x2="60" y2="110" stroke={armorEnd} strokeWidth="2.5" opacity="0.8" />
            <line x1="75" y1="60" x2="72" y2="110" stroke={armorEnd} strokeWidth="1.5" opacity="0.7" />

            <g filter="url(#fixGlow)">
                <circle cx="60" cy="74" r="6" fill={armorEnd} stroke={glowColor} strokeWidth="1.2" />
                <circle cx="60" cy="74" r="2" fill={glowColor} />

                <circle cx="52" cy="65" r="1.5" fill={glowColor} opacity="0.6" />
                <circle cx="68" cy="65" r="1.5" fill={glowColor} opacity="0.6" />
            </g>

            <g filter="url(#fixGlow)">
                <path d="M56 110 L60 120 L64 110 Z" fill={glowColor} />
                <path d="M50 115 Q60 120, 70 115" stroke={glowColor} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
            </g>

            <path
                d="M46 125 C52 130, 68 130, 74 125"
                stroke={glowColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
                filter="url(#fixGlow)"
            />
        </g>
    </svg>
);






