import { useState, useEffect } from 'react';

export const SciFiDice = ({ isRollAvailable, onRollComplete, x = 0 }) => {
    const [isRolling, setIsRolling] = useState(false);
    const [displayValue, setDisplayValue] = useState(1);
    const [rotation, setRotation] = useState(0);

    // Имитация вращения и подбора случайных цифр
    useEffect(() => {
        let interval;
        if (isRolling) {
            let ticks = 0;
            interval = setInterval(() => {
                // Быстро меняем цифры на гранях во время анимации
                setDisplayValue(Math.floor(Math.random() * 6) + 1);
                setRotation(prev => prev + 45); // Крутим куб
                ticks++;

                // Через 800мс останавливаем анимацию и выдаем финальный результат
                if (ticks > 8) {
                    clearInterval(interval);
                    const finalResult = Math.floor(Math.random() * 6) + 1;
                    setDisplayValue(finalResult);
                    setRotation(0); // Возвращаем в стабильное положение
                    setIsRolling(false);
                    if (onRollComplete) onRollComplete(finalResult);
                }
            }, 90);
        }
        return () => clearInterval(interval);
    }, [isRolling, onRollComplete]);

    const handleTap = () => {
        if (!isRollAvailable || isRolling) return;
        setIsRolling(true);
    };

    return (
            <svg x={x - 60} onClick={handleTap} style={styles.main} width={50} height={50} viewBox={"0 0 100 100"}   >
                <defs>
                    {/* Фильтр размытия при сильном вращении (Голографический эффект) */}
                    <filter id="motion-blur" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation={isRolling ? "2" : "0"} />
                    </filter>

                    {/* Свечение для активного кубика */}
                    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <g
                    filter="url(#motion-blur)"
                    transform={`rotate(${rotation}, 50, 50)`}
                    style={{ transition: isRolling ? 'none' : 'transform 0.3s ease-out' }}
                >
                    {/* Внешний изометрический каркас куба */}
                    <polygon
                        points="50,15 85,32 85,68 50,85 15,68 15,32"
                        fill="#1F242D"
                        stroke={isRollAvailable ? "#00F0FF" : "#3A4250"}
                        strokeWidth="3"
                        filter={isRollAvailable && !isRolling ? "url(#neon-glow)" : "none"}
                    />

                    {/* Внутренние грани для объема (эффект 3D-кристалла) */}
                    <line x1="50" y1="15" x2="50" y2="85" stroke="#11141A" strokeWidth="1.5" opacity="0.5" />
                    <line x1="50" y1="50" x2="15" y2="32" stroke="#11141A" strokeWidth="1.5" opacity="0.5" />
                    <line x1="50" y1="50" x2="85" y2="32" stroke="#11141A" strokeWidth="1.5" opacity="0.5" />

                    {/* Светящиеся ребра жесткости на углах */}
                    <circle cx="50" cy="15" r="2" fill="#00F0FF" opacity={isRollAvailable ? 0.8 : 0.3} />
                    <circle cx="85" cy="32" r="2" fill="#00F0FF" opacity={isRollAvailable ? 0.8 : 0.3} />
                    <circle cx="85" cy="68" r="2" fill="#00F0FF" opacity={isRollAvailable ? 0.8 : 0.3} />
                    <circle cx="50" cy="85" r="2" fill="#00F0FF" opacity={isRollAvailable ? 0.8 : 0.3} />
                    <circle cx="15" cy="68" r="2" fill="#00F0FF" opacity={isRollAvailable ? 0.8 : 0.3} />
                    <circle cx="15" cy="32" r="2" fill="#00F0FF" opacity={isRollAvailable ? 0.8 : 0.3} />

                    {/* Отрисовка Sci-Fi неонового индикатора цифры по центру верхней проекции */}
                    <g transform="translate(50, 48)" filter={isRollAvailable ? "url(#neon-glow)" : "none"}>
                        <text
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={isRollAvailable ? "#00F0FF" : "#556275"}
                            fontSize="26"
                            fontWeight="bold"
                            fontFamily="monospace"
                            style={{ letterSpacing: '1px' }}
                        >
                            {displayValue}
                        </text>
                    </g>

                    {/* Декоративный радарный круг под цифрой */}
                    <circle cx="50" cy="50" r="18" fill="none" stroke="#00F0FF" strokeWidth="1" strokeDasharray="4 8" opacity="0.2" />
                </g>
            </svg>
    );
};

export const AlienArtifact = ({ size = 100, color = "#00F0FF" }) => {
    return (
        <svg width={size} height={size} viewBox="-50 -50 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glowArtifact" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <radialGradient id="crystalGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8"/>
                    <stop offset="60%" stopColor={color} stopOpacity="0.3"/>
                    <stop offset="100%" stopColor={color} stopOpacity="0"/>
                </radialGradient>
            </defs>
            <g filter="url(#glowArtifact)">
                <path d="M50 10 C 75 10, 90 25, 90 50 C 90 75, 75 90, 50 90 C 25 90, 10 75, 10 50 C 10 25, 25 10, 50 10 Z"
                      stroke={color} strokeWidth="1.5" strokeDasharray="10 5" opacity="0.7"/>
                <path d="M50 20 C 70 20, 80 30, 80 50 C 80 70, 70 80, 50 80 C 30 80, 20 70, 20 50 C 20 30, 30 20, 50 20 Z"
                      stroke={color} strokeWidth="1" opacity="0.5"/>
                <path d="M50 25 L 65 50 L 50 75 L 35 50 Z" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M50 35 L 58 50 L 50 65 L 42 50 Z" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.8"/>
                <ellipse cx="50" cy="50" rx="8" ry="12" fill="url(#crystalGradient)"/>
                <circle cx="50" cy="50" r="2" fill="#FFFFFF"/>
                {/* Анимированные частицы */}
                <circle cx="62" cy="42" r="1" fill={color}><animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" /></circle>
                <circle cx="38" cy="58" r="1" fill={color}><animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" /></circle>
                <circle cx="58" cy="62" r="1" fill="#FFFFFF"><animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" /></circle>
                <circle cx="42" cy="38" r="1" fill="#FFFFFF"><animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite" /></circle>
                <path d="M40 85 L 50 95 L 60 85" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </g>
        </svg>
    );
};

export const EnergyCore = ({ size = 200, mainColor = "#00FFFF" }) => {
    return (
        <svg width={size} height={size} x={0} y={0} viewBox="-100 -100 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="neonGlowCore" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feFlood floodColor={mainColor} result="glowColor"/>
                    <feComposite in="glowColor" in2="blur" operator="in" result="softGlow"/>
                    <feMerge>
                        <feMergeNode in="softGlow"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>

                <filter id="coreIntensityCore" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur"/>
                    <feFlood floodColor="#FFFFFF" result="whiteGlow"/>
                    <feComposite in="whiteGlow" in2="blur" operator="in" result="softWhiteGlow"/>
                    <feMerge>
                        <feMergeNode in="softWhiteGlow"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>

                <linearGradient id="ringGradientCore" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={mainColor}/>
                    <stop offset="50%" stopColor="#007BFF"/>
                    <stop offset="100%" stopColor="#4B0082"/>
                </linearGradient>

                <radialGradient id="corePlasmaCore" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#FFFFFF"/>
                    <stop offset="40%" stopColor={mainColor} stopOpacity="0.8"/>
                    <stop offset="80%" stopColor="#007BFF" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
                </radialGradient>
            </defs>

            <g filter="url(#neonGlowCore)" strokeWidth="1.5" stroke="url(#ringGradientCore)">
                <ellipse cx="100" cy="100" rx="90" ry="20" transform="rotate(90, 100, 100)" strokeDasharray="20 10"/>
                <ellipse cx="100" cy="100" rx="90" ry="20" strokeDasharray="10 5"/>
                <ellipse cx="100" cy="100" rx="80" ry="15" transform="rotate(45, 100, 100)"/>
                <ellipse cx="100" cy="100" rx="80" ry="15" transform="rotate(-45, 100, 100)"/>
            </g>

            <circle cx="100" cy="100" r="60" fill="url(#corePlasmaCore)" filter="url(#neonGlowCore)"/>

            <g stroke="#FFFFFF" strokeWidth="0.75" fill="none" opacity="0.6">
                <path d="M70,100 Q100,70 130,100 Q100,130 70,100 Z"/>
                <path d="M100,70 Q130,100 100,130 Q70,100 100,70 Z"/>
                <path d="M78.8,121.2 L121.2,78.8"/>
                <path d="M78.8,78.8 L121.2,121.2"/>
            </g>

            <g filter="url(#coreIntensityCore)">
                <circle cx="100" cy="100" r="12" fill="#FFFFFF"/>
                <path d="M100,80 L104,96 L120,100 L104,104 L100,120 L96,104 L80,100 L96,96 Z" fill="#FFFFFF"/>
            </g>
        </svg>
    );
};

export function DataPad(){
    return <svg x={15} y={25} width="100" height="100" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feFlood floodColor="#00FFFF" floodOpacity="0.7" result="glowColor"/>
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow"/>
                <feMerge>
                    <feMergeNode in="softGlow"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>


            <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feFlood floodColor="#BD00FF" floodOpacity="0.6" result="glowColor"/>
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow"/>
                <feMerge>
                    <feMergeNode in="softGlow"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>


            <linearGradient id="screenBG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#051020"/>
                <stop offset="100%" stopColor="#0A0515"/>
            </linearGradient>


            <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2A303A"/>
                <stop offset="100%" stopColor="#101218"/>
            </linearGradient>
        </defs>


        <rect x="10" y="10" width="580" height="380" rx="25" fill="url(#frameGradient)" stroke="#404550" strokeWidth="2"/>


        <path d="M150 10 L450 10 L430 30 L170 30 Z" fill="#1A1F26" stroke="#404550"/>
        <path d="M150 390 L450 390 L430 370 L170 370 Z" fill="#1A1F26" stroke="#404550"/>


        <rect x="15" y="100" width="15" height="200" rx="5" fill="#15181D"/>
        <rect x="570" y="100" width="15" height="200" rx="5" fill="#15181D"/>


        <g transform="translate(480, 15)" stroke="#00FFFF" strokeWidth="1.5" fill="none" filter="url(#neonGlow)">
            <circle cx="0" cy="0" r="8"/>
            <circle cx="25" cy="0" r="8"/>
            <rect x="42" y="-8" width="16" height="16" rx="3"/>
        </g>


        <rect x="40" y="40" width="520" height="320" rx="15" fill="url(#screenBG)" stroke="#00FFFF" strokeWidth="1" filter="url(#neonGlow)"/>


        <g transform="translate(60, 60)" filter="url(#neonGlow)">
            <text x="0" y="20" fill="#FFFFFF" fontFamily="monospace" fontSize="14" fontWeight="bold">STATUS: ACTIVE</text>
            <text x="0" y="45" fill="#00FFFF" fontFamily="monospace" fontSize="11" opacity="0.8">SYSTEM_LOG_v3.1</text>


            <g transform="translate(0, 65)" stroke="#00FFFF" strokeWidth="1" opacity="0.6">
                <line x1="0" y1="0" x2="180" y2="0"/>
                <line x1="0" y1="10" x2="160" y2="10"/>
                <line x1="0" y1="20" x2="170" y2="20"/>
                <line x1="0" y1="30" x2="140" y2="30"/>
            </g>


            <g transform="translate(0, 120)" fill="#00FFFF">
                <rect x="0" y="0" width="15" height="60" opacity="0.8"/>
                <rect x="25" y="10" width="15" height="50" opacity="0.6"/>
                <rect x="50" y="-10" width="15" height="70" opacity="1"/>
                <rect x="75" y="20" width="15" height="40" opacity="0.5"/>
            </g>
        </g>


        <g transform="translate(300, 200)" filter="url(#neonGlow)">

            <circle cx="0" cy="0" r="15" fill="#FFFFFF"/>
            <circle cx="0" cy="0" r="25" stroke="#00FFFF" strokeWidth="1" strokeDasharray="5 5"/>


            <g stroke="#00FFFF" strokeWidth="1.2" fill="none">
                <circle cx="0" cy="0" r="60"/>
                <ellipse cx="0" cy="0" rx="100" ry="40" transform="rotate(15)"/>
                <ellipse cx="0" cy="0" rx="100" ry="40" transform="rotate(-15)"/>
            </g>


            <circle cx="58" cy="15" r="4" fill="#FFFFFF"/>
            <circle cx="-85" cy="-25" r="3" fill="#00FFFF"/>
            <circle cx="95" cy="-10" r="3" fill="#00FFFF"/>
        </g>


        <g transform="translate(410, 60)" filter="url(#purpleGlow)">
            <text x="0" y="20" fill="#FFFFFF" fontFamily="monospace" fontSize="14" fontWeight="bold">ANALYSIS</text>


            <g transform="translate(0, 45)" stroke="#BD00FF" strokeWidth="1" opacity="0.7">
                <line x1="0" y1="0" x2="130" y2="0"/>
                <line x1="0" y1="10" x2="110" y2="10"/>
                <line x1="0" y1="20" x2="120" y2="20"/>
            </g>


            <g transform="translate(100, -5)" stroke="#BD00FF" strokeWidth="1.5" fill="none">
                <circle cx="0" cy="0" r="10"/>
                <circle cx="25" cy="0" r="10"/>
                <path d="M0 -5 L0 5 M-5 0 L5 0" strokeWidth="1"/>
            </g>


            <g transform="translate(90, 100)" stroke="#BD00FF" strokeWidth="1" fill="none">
                <rect x="0" y="0" width="40" height="120" rx="5"/>
                <path d="M5 20 Q20 5, 35 20 T5 50 Q20 35, 35 50 T5 80" strokeWidth="1.5"/>
            </g>
        </g>

    </svg>

}

export function Keycard(){
    return <svg width="90"  viewBox="-30 160 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect fill={"#FF0000"} width={"100%"} height={"100%"}/>
        <defs>
            <filter id="dimGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur"/>
                <feFlood floodColor="#00C8FF" floodOpacity="0.4" result="glowColor"/>
                <feComposite in="glowColor" in2="blur" operator="in" result="softGlow"/>
                <feMerge>
                    <feMergeNode in="softGlow"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>


            <filter id="errorPulse" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feFlood floodColor="#FF0000" result="flood"/>
                <feComposite in="flood" in2="blur" operator="in" result="glow"/>
                <feMerge>
                    <feMergeNode in="glow"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>


            <filter id="scratches" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" result="noise"/>
                <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.15 1" in="noise" result="dirtyNoise"/>
                <feComposite operator="in" in="dirtyNoise" in2="SourceGraphic"/>
            </filter>


            <linearGradient id="rustedMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2A2F35"/>
                <stop offset="60%" stopColor="#3A4048"/>
                <stop offset="85%" stopColor="#554433"/>
                <stop offset="100%" stopColor="#2A2F35"/>
            </linearGradient>


            <linearGradient id="magStripe" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1A1A1A"/>
                <stop offset="100%" stopColor="#050505"/>
            </linearGradient>
        </defs>


        <rect x="5" y="5" width="290" height="170" rx="12" fill="url(# rustedMetal)" stroke="#1A1F26" strokeWidth="2"/>


        <rect x="5" y="5" width="290" height="170" rx="12" fill="none" filter="url(#scratches)" opacity="0.3"/>


        <rect x="15" y="15" width="270" height="150" rx="8" stroke="#00C8FF" strokeWidth="1" filter="url(#dimGlow)" opacity="0.5"/>


        <g transform="translate(25, 25)" filter="url(#dimGlow)">

            <path d="M0 10 A 15 15 0 1 1 20 25 M 5 15 L 15 15 L 15 5" stroke="#00C8FF" strokeWidth="2.5" fill="none" strokeLinecap="round"/>


            <text x="35" y="15" fill="#FFFFFF" fontFamily="monospace" fontSize="16" fontWeight="bold" letterSpacing="1">LOSTSTATION</text>
            <text x="35" y="32" fill="#00C8FF" fontFamily="monospace" fontSize="11" opacity="0.8">SYSTEM ACCESS KEY</text>


            <g transform="translate(210, 0)">
                <rect x="0" y="0" width="60" height="30" rx="4" fill="#1A1F26" stroke="#00C8FF" strokeWidth="1"/>
                <text x="30" y="20" fill="#FFFFFF" fontFamily="monospace" fontSize="16" fontWeight="bold" textAnchor="middle">LVL 3</text>
            </g>
        </g>


        <g transform="translate(30, 80)">
            <rect x="0" y="0" width="50" height="40" rx="3" fill="#B59963" stroke="#806040"/>

            <g stroke="#806040" strokeWidth="1" fill="none">
                <path d="M10 0 L10 40 M25 0 L25 40 M40 0 L40 40"/>
                <path d="M0 13 L50 13 M0 27 L50 27"/>
                <circle cx="25" cy="20" r="5" strokeWidth="1.5"/>
            </g>

            <circle cx="15" cy="10" r="6" fill="#408060" opacity="0.3" filter="url(#scratches)"/>
        </g>


        <g transform="translate(100, 85)" filter="url(#dimGlow)">
            <text x="0" y="12" fill="#AAAAAA" fontFamily="monospace" fontSize="10">STATUS:</text>


            <circle cx="55" cy="8" r="5" fill="#FF0000" filter="url(#errorPulse)">
                <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <text x="65" y="12" fill="#FF4444" fontFamily="monospace" fontSize="10" fontWeight="bold">ERR_CONN</text>


            <text x="0" y="35" fill="#FFFFFF" fontFamily="monospace" fontSize="12">ID: ENGINEER_ST_77</text>
        </g>

        <rect x="15" y="140" width="270" height="25" rx="2" fill="url(#magStripe)" stroke="#1A1F26"/>
        <rect x="15" y="140" width="270" height="25" rx="2" fill="none" filter="url(#scratches)" opacity="0.4"/>


        <text x="25" y="157" fill="#666666" fontFamily="monospace" fontSize="9" letterSpacing="1">SN: LS-4192-A837-BC</text>


        <g fill="#1A1F26" stroke="#404550" strokeWidth="1">
            <circle cx="15" cy="15" r="3"/><path d="M13 15 L17 15 M15 13 L15 17"/>
            <circle cx="285" cy="15" r="3"/><path d="M283 15 L287 15 M285 13 L285 17"/>
            <circle cx="15" cy="165" r="3"/><path d="M13 165 L17 165 M15 163 L15 167"/>
            <circle cx="285" cy="165" r="3"/><path d="M283 165 L287 165 M285 163 L285 167"/>
        </g>
    </svg>

}

export const GravityBoosterIcon = ({ size = 100, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                {/* Свечение центрального ядра */}
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00F0FF" stopOpacity="1" />
                    <stop offset="50%" stopColor="#0072FF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#001F3F" stopOpacity="0" />
                </radialGradient>

                {/* Градиент для силовых колец */}
                <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="100%" stopColor="#0055FF" />
                </linearGradient>

                {/* Мягкая тень под бустером */}
                <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Фоновое кольцо-разметка */}
            <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#00F0FF"
                strokeWidth="1"
                strokeOpacity="0.25"
                strokeDasharray="4 6"
            />

            {/* Внешние ограничители корпуса (скобки) */}
            <path
                d="M 25 15 A 40 40 0 0 0 15 35"
                stroke="url(#cyanGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M 15 65 A 40 40 0 0 0 25 85"
                stroke="url(#cyanGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M 75 85 A 40 40 0 0 0 85 65"
                stroke="url(#cyanGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M 85 35 A 40 40 0 0 0 75 15"
                stroke="url(#cyanGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Стрелки гравитационного вектора (вверх-вниз) */}
            {/* Стрелка Вверх */}
            <path
                d="M 50 16 L 44 24 L 48 24 L 48 30 L 52 30 L 52 24 L 56 24 Z"
                fill="#00F0FF"
                opacity="0.8"
                filter="url(#neonBlur)"
            />
            {/* Стрелка Вниз */}
            <path
                d="M 50 84 L 44 76 L 48 76 L 48 70 L 52 70 L 52 76 L 56 76 Z"
                fill="#00F0FF"
                opacity="0.8"
                filter="url(#neonBlur)"
            />

            {/* Внешнее вращающееся силовое кольцо */}
            <g>
                <circle
                    cx="50"
                    cy="50"
                    r="30"
                    stroke="url(#cyanGrad)"
                    strokeWidth="2"
                    strokeDasharray="15 40 30 15"
                    filter="url(#neonBlur)"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="6s"
                        repeatCount="indefinite"
                    />
                </circle>
            </g>

            {/* Внутреннее быстро вращающееся кольцо (в обратную сторону) */}
            <g>
                <circle
                    cx="50"
                    cy="50"
                    r="22"
                    stroke="#00F0FF"
                    strokeWidth="1.5"
                    strokeDasharray="10 20 5 10"
                    strokeOpacity="0.7"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="360 50 50"
                        to="0 50 50"
                        dur="4s"
                        repeatCount="indefinite"
                    />
                </circle>
            </g>

            {/* Пульсирующее гравитационное ядро */}
            <circle cx="50" cy="50" r="14" fill="url(#coreGlow)">
                <animate
                    attributeName="r"
                    values="11;14;11"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>

            {/* Маленький яркий центр ядра */}
            <circle cx="50" cy="50" r="5" fill="#FFFFFF" filter="url(#neonBlur)">
                <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
    );
};

export const QuantumWrenchIcon = ({ size = 100, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                {/* Мягкое неоновое свечение квантовых элементов */}
                <filter id="wrenchGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Градиент для металлического корпуса */}
                <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4A5568" />
                    <stop offset="50%" stopColor="#718096" />
                    <stop offset="100%" stopColor="#2D3748" />
                </linearGradient>

                {/* Квантовый бирюзово-зеленый градиент энергии */}
                <linearGradient id="quantumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00FFCC" />
                    <stop offset="100%" stopColor="#0099FF" />
                </linearGradient>

                {/* Свечение энергетического ядра */}
                <radialGradient id="coreEnergy" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00FFCC" stopOpacity="1" />
                    <stop offset="60%" stopColor="#0055FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#0B132B" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Фоновые направляющие вращения (орбиты) */}
            <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#00FFCC"
                strokeWidth="0.75"
                strokeOpacity="0.2"
                strokeDasharray="2 4"
            />
            <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#00FFCC"
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="12 12"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="10s"
                    repeatCount="indefinite"
                />
            </circle>

            {/* Квантовое ядро в центре инструмента */}
            <circle cx="50" cy="50" r="16" fill="url(#coreEnergy)" />

            {/* Сборный корпус Ключа-Мультитула */}
            <g>
                {/* Рукоять и основание ключа */}
                <rect
                    x="46"
                    y="58"
                    width="8"
                    height="26"
                    rx="4"
                    fill="url(#metalGrad)"
                    stroke="#00FFCC"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                />

                {/* Металлическая круглая головка ключа с прорезью сверху (зев ключа) */}
                <path
                    d="M 30 50
             A 20 20 0 1 0 70 50
             A 20 20 0 0 0 62 34
             L 56 42
             A 10 10 0 0 1 44 42
             L 38 34
             A 20 20 0 0 0 30 50 Z"
                    fill="url(#metalGrad)"
                    stroke="#718096"
                    strokeWidth="1"
                />

                {/* Наконечник рукояти (энерго-ячейка) */}
                <circle cx="50" cy="80" r="3" fill="#00FFCC" filter="url(#wrenchGlow)" />

                {/* Декоративные пазы на корпусе */}
                <line x1="50" y1="64" x2="50" y2="74" stroke="#1A202C" strokeWidth="2" strokeLinecap="round" />

                {/* Анимация покачивания всего ключа (эффект левитации в инвентаре) */}
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 -2; 0 0"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </g>

            {/* Фокусирующие квантовые излучатели (активные дуги внутри зева) */}
            <path
                d="M 36 46 A 14 14 0 0 1 64 46"
                stroke="url(#quantumGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#wrenchGlow)"
            />

            {/* Вращающиеся «зубья» квантового захвата (силовые дуги вращения) */}
            <g>
                <path
                    d="M 32 50 A 18 18 0 0 0 68 50"
                    stroke="#00FFCC"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="6 8 12 6"
                    filter="url(#wrenchGlow)"
                />
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="-360 50 50"
                    dur="5s"
                    repeatCount="indefinite"
                />
            </g>

            {/* Центральный парящий квантовый узел */}
            <g>
                {/* Квадратный силовой замок */}
                <rect
                    x="44"
                    y="44"
                    width="12"
                    height="12"
                    rx="2"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    fill="none"
                    filter="url(#wrenchGlow)"
                />
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </g>

            {/* Вспыхивающий индикатор готовности в самом центре */}
            <circle cx="50" cy="50" r="3" fill="#FFFFFF" filter="url(#wrenchGlow)">
                <animate
                    attributeName="opacity"
                    values="0.4;1;0.4"
                    dur="1.5s"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
    );
};

export const VoidRadarIcon = ({ size = 100, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                {/* Фильтр неонового свечения для радарных волн */}
                <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Фиолетово-синий градиент Бездны */}
                <linearGradient id="voidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" /> {/* Фиолетовый */}
                    <stop offset="100%" stopColor="#3B82F6" /> {/* Синий */}
                </linearGradient>

                {/* Свечение сканирующего луча */}
                <radialGradient id="beamSweep" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#090514" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Внешний круг корпуса локатора */}
            <circle
                cx="50"
                cy="50"
                r="44"
                stroke="url(#voidGrad)"
                strokeWidth="2"
                strokeOpacity="0.8"
            />

            {/* Координатная сетка локатора (Круговые шкалы) */}
            <circle cx="50" cy="50" r="32" stroke="#A855F7" strokeWidth="0.75" strokeOpacity="0.3" />
            <circle cx="50" cy="50" r="20" stroke="#3B82F6" strokeWidth="0.75" strokeOpacity="0.3" />
            <circle cx="50" cy="50" r="8" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.2" />

            {/* Перекрестие визира радара */}
            <line x1="50" y1="10" x2="50" y2="90" stroke="#3B82F6" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="3 3" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#3B82F6" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="3 3" />

            {/* Декоративные угловые засечки корпуса */}
            <path d="M 50 6 L 46 12 H 54 Z" fill="url(#voidGrad)" />
            <path d="M 50 94 L 46 88 H 54 Z" fill="url(#voidGrad)" />
            <path d="M 6 50 L 12 46 V 54 Z" fill="url(#voidGrad)" />
            <path d="M 94 50 L 88 46 V 54 Z" fill="url(#voidGrad)" />

            {/* Вращающийся сканирующий сектор (конус радара) */}
            <g>
                {/* Мы используем дугу, имитирующую радарный конус */}
                <path
                    d="M 50 50 L 50 10 A 40 40 0 0 1 78 21 Z"
                    fill="url(#beamSweep)"
                />
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="4s"
                    repeatCount="indefinite"
                />
            </g>

            {/* Расширяющиеся эхо-импульсы (волны сонара) */}
            <circle cx="50" cy="50" r="6" stroke="#A855F7" strokeWidth="1.5" filter="url(#radarGlow)" opacity="0">
                <animate attributeName="r" values="6;42;42" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.4;0" dur="3s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="2;0.5;0" dur="3s" repeatCount="indefinite" />
            </circle>

            <circle cx="50" cy="50" r="6" stroke="#3B82F6" strokeWidth="1.5" filter="url(#radarGlow)" opacity="0">
                {/* Задержка второй волны на 1.5 секунды */}
                <animate attributeName="r" values="6;42;42" dur="3s" begin="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.4;0" dur="3s" begin="1.5s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="2;0.5;0" dur="3s" begin="1.5s" repeatCount="indefinite" />
            </circle>

            {/* Зафиксированная обнаруженная цель (сигнал сокровища на радаре) */}
            <g filter="url(#radarGlow)">
                {/* Точка цели */}
                <circle cx="70" cy="35" r="2.5" fill="#00FFCC">
                    {/* Мерцание засеченной цели */}
                    <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* Индикатор захвата цели */}
                <circle cx="70" cy="35" r="5" stroke="#00FFCC" strokeWidth="0.75" strokeDasharray="2 2">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 70 35"
                        to="360 70 35"
                        dur="3s"
                        repeatCount="indefinite"
                    />
                </circle>
            </g>

            {/* Стабильное центральное ядро датчика */}
            <circle cx="50" cy="50" r="4" fill="#FFFFFF" filter="url(#radarGlow)" />
        </svg>
    );
};

export const PlasmaCutterIcon = ({ size = 100, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                {/* Экстремально яркое неоновое свечение плазмы */}
                <filter id="plasmaGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Промышленный оранжево-стальной градиент для корпуса резака */}
                <linearGradient id="cutterMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" /> {/* Ярко-оранжевый */}
                    <stop offset="60%" stopColor="#EA580C" />
                    <stop offset="100%" stopColor="#431407" /> {/* Темный индустриальный */}
                </linearGradient>

                {/* Энергетический плазменный градиент */}
                <linearGradient id="plasmaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF3B30" />
                    <stop offset="50%" stopColor="#FFCC00" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
            </defs>

            {/* Фоновые индикаторы опасности/разогрева */}
            <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#F97316"
                strokeWidth="1"
                strokeOpacity="0.15"
                strokeDasharray="6 4"
            />

            {/* Массивный силовой генератор в основании резака */}
            <g>
                {/* Главная катушка питания */}
                <rect x="36" y="66" width="28" height="20" rx="3" fill="url(#cutterMetal)" stroke="#7C2D12" strokeWidth="1.5" />
                <rect x="40" y="70" width="20" height="4" fill="#1E293B" rx="1" />
                <rect x="40" y="78" width="20" height="4" fill="#1E293B" rx="1" />

                {/* Коннекторы плазменных направляющих */}
                <path d="M 32 66 L 40 46 H 60 L 68 66 Z" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
            </g>

            {/* Левый направляющий электрод */}
            <g>
                <path
                    d="M 28 46
             C 20 46, 18 30, 26 16
             L 32 20
             C 26 30, 28 40, 36 44
             Z"
                    fill="url(#cutterMetal)"
                    stroke="#7C2D12"
                    strokeWidth="1"
                />
                {/* Фокусирующий наконечник электрода */}
                <circle cx="28" cy="18" r="2.5" fill="#E2E8F0" />
            </g>

            {/* Правый направляющий электрод (симметрично отражен) */}
            <g>
                <path
                    d="M 72 46
             C 80 46, 82 30, 74 16
             L 68 20
             C 74 30, 72 40, 64 44
             Z"
                    fill="url(#cutterMetal)"
                    stroke="#7C2D12"
                    strokeWidth="1"
                />
                {/* Фокусирующий наконечник электрода */}
                <circle cx="72" cy="18" r="2.5" fill="#E2E8F0" />
            </g>

            {/* Высокотемпературная плазменная дуга между электродами */}
            <g filter="url(#plasmaGlow)">
                {/* Внешнее тепловое поле дуги */}
                <path d="M 28 18 Q 50 8 72 18" stroke="#FF3B30" strokeWidth="6" strokeLinecap="round" opacity="0.4" />

                {/* Средний концентрированный поток */}
                <path d="M 28 18 Q 50 8 72 18" stroke="url(#plasmaGrad)" strokeWidth="3" strokeLinecap="round">
                    {/* Анимация хаотичного дрожания плазмы по оси Y */}
                    <animate
                        attributeName="d"
                        values="M 28 18 Q 50 8 72 18; M 28 18 Q 50 12 72 18; M 28 18 Q 50 6 72 18; M 28 18 Q 50 8 72 18"
                        dur="0.15s"
                        repeatCount="indefinite"
                    />
                </path>

                {/* Сверхгорячее белое ядро плазменного луча */}
                <path d="M 28 18 Q 50 8 72 18" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round">
                    <animate
                        attributeName="d"
                        values="M 28 18 Q 50 8 72 18; M 28 18 Q 50 12 72 18; M 28 18 Q 50 6 72 18; M 28 18 Q 50 8 72 18"
                        dur="0.15s"
                        repeatCount="indefinite"
                    />
                </path>
            </g>

            {/* Летящие плазменные искры (эффект активного горения/резки) */}
            <g filter="url(#plasmaGlow)">
                {/* Искра 1 */}
                <circle cx="42" cy="10" r="1.5" fill="#FFCC00">
                    <animate attributeName="cy" values="10;-15" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="42;35" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0" dur="0.8s" repeatCount="indefinite" />
                </circle>

                {/* Искра 2 */}
                <circle cx="58" cy="10" r="1.2" fill="#FF9500">
                    <animate attributeName="cy" values="10;-20" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="58;65" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
                </circle>

                {/* Искра 3 (взлетает строго вверх) */}
                <circle cx="50" cy="8" r="1.8" fill="#FFFFFF">
                    <animate attributeName="cy" values="8;-25" dur="0.5s" begin="0.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0" dur="0.5s" begin="0.4s" repeatCount="indefinite" />
                </circle>
            </g>

            {/* Индикаторы заряда внизу катушки */}
            <g>
                <circle cx="44" cy="81" r="1.5" fill="#22C55E">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="81" r="1.5" fill="#22C55E">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" begin="0.3s" repeatCount="indefinite" />
                </circle>
                <circle cx="56" cy="81" r="1.5" fill="#22C55E">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" begin="0.6s" repeatCount="indefinite" />
                </circle>
            </g>
        </svg>
    );
};

export function RotateIcon() {
    return <svg opacity={0.2} transform={'translate(-50 -50)'} xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="#fff" viewBox="-4.5 -4.5 100 100">
        <path
            d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
        <path fillRule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
    </svg>
}

const styles = {
    main: {
        cursor: "pointer",
        right: "0px"
    }
}