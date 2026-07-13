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
const styles = {
    main:{
        cursor: "pointer",
        right:"0px"
    }
}