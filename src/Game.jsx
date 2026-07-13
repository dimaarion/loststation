import {useCallback, useEffect, useState} from "react";
import {findAvailablePaths, getCameraOffset} from "./action.js";
import SpaseBase from "./components/SpaseBase.jsx";
import {SpaceDroidToken} from "./components/Players.jsx";
import {SciFiDice} from "./components/Objects.jsx";
import TopPanel from "./ui/TopPanel.jsx";

export default function Game({maze = []}){
    const [pathsData, setPathsData] = useState({});
    const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
    const [isMovingAnimation, setIsMovingAnimation] = useState(false);
    const [botWasStuck, setBotWasStuck] = useState(false);
    const rt = 1000
    const [ratio, setRatio] = useState((window.innerWidth + window.innerHeight) / rt);
    const [availableMoves, setAvailableMoves] = useState([]);
    const [gamePhase, setGamePhase] = useState("ROLL");
    const [players, setPlayers] = useState([
        { id: 1, name: 'Дроид АЛЬФА', x: 1, y: 0, color: '#00F0FF', stepsLeft: 0, isAI: false },
        { id: 2, name: 'Механоид ИИ-88', x: 0, y: 0, color: '#FF9900', stepsLeft: 0, isAI: true } // Бот
    ]);
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);
    const [board, setBoard] = useState(maze);


    const { offsetX, offsetY } = getCameraOffset(
        players[activePlayerIndex].x,
        players[activePlayerIndex].y,
        size.width / ratio,
        size.height / ratio,
    );

    const handleDiceRollComplete = useCallback((result) => {
        const player = players[activePlayerIndex];
        // Находим все пути вдоль стен
        const paths = findAvailablePaths(player.x, player.y, result, board);
        setPathsData(paths);
        setGamePhase('MOVE');
       return null
    },[players, activePlayerIndex, board]);



    const animateRoute = useCallback((targetKey) => {
        if (isMovingAnimation) return;

        const route = pathsData[targetKey]; // Например: [[0,0], [1,0], [1,1]] или [[0,0]] (если клик по себе)
        if (!route) return;

        // СЛУЧАЙ 1: Игрок никуда не идет (выпало 0 или кликнул на свою текущую клетку)
        if (route.length <= 1) {
            setPathsData({}); // Сбрасываем подсвеченные пути
            setGamePhase('ROTATE'); // Сразу даем возможность вращать плитки вокруг себя
            return;
        }

        // СЛУЧАЙ 2: Извилистый маршрут существует, запускаем анимацию движения
        setIsMovingAnimation(true);
        let currentStep = 1; // Начинаем с первого шага (индекс 1)

        const movementInterval = setInterval(() => {
            // Защитная проверка на случай, если элемент массива по какой-то причине отсутствует
            if (!route[currentStep]) {
                clearInterval(movementInterval);
                setIsMovingAnimation(false);
                setPathsData({});
                setGamePhase('ROTATE');
                return;
            }

            const [nextX, nextY] = route[currentStep];

            // Сдвигаем игрока на одну плитку вперёд по маршруту
            setPlayers(prev => prev.map((p, idx) =>
                idx === activePlayerIndex ? { ...p, x: nextX, y: nextY, stepsLeft: Math.max(0, p.stepsLeft - 1) } : p
            ));

            // Проверяем и собираем сокровище на текущей промежуточной плитке
            setBoard(prevBoard =>
                prevBoard.map(row =>
                    row.map(tile =>
                        tile.x === nextX && tile.y === nextY && tile.treasure
                            ? { ...tile, treasure: null } // Дроид подобрал сокровище на ходу!
                            : tile
                    )
                )
            );

            currentStep++;

            // Если прошли весь маршрут до конца
            if (currentStep >= route.length) {
                clearInterval(movementInterval);
                setIsMovingAnimation(false);
                setPathsData({}); // Сбрасываем подсвеченные пути
                setGamePhase('ROTATE'); // Переходим к вращению плиток
            }

        }, 250); // Скорость шага дроида
    }, [activePlayerIndex, isMovingAnimation, pathsData]);

    const handleTileRotate = useCallback((targetX, targetY) => {

        // 1. Проверяем, что сейчас действительно фаза вращения и дроид не находится в движении
        if (gamePhase === 'MOVE' || isMovingAnimation) return;

        const currentPlayer = players[activePlayerIndex];

        // 2. Расчет дистанции: проверяем, что плитка находится в радиусе 1 шага
        // (0 — плитка под игроком, 1 — соседние плитки крестом. Диагонали выдадут 2, они отсекаются)
        const distance = Math.abs(currentPlayer.x - targetX) + Math.abs(currentPlayer.y - targetY);
        if (distance <= 1) {
            // 3. Вращаем выбранную плитку в массиве board на 90 градусов
            setBoard(prevBoard =>
                prevBoard.map(row =>
                    row.map(tile => {
                        if (tile.x === targetX && tile.y === targetY) {
                            // Прибавляем 90° и сбрасываем на 0 при достижении 360°
                            return { ...tile, rotation: (tile.rotation + 90) % 360 };
                        }
                        return tile;
                    })
                )
            );

            // 4. ПЕРЕКЛЮЧЕНИЕ ХОДА НА СЛЕДУЮЩЕГО ИГРОКА
            setAvailableMoves([]); // На всякий случай очищаем подсветку

            setPlayers(prev => {
                // Переключаем индекс активного игрока по кругу
                const nextPlayerIndex = (activePlayerIndex + 1) % prev.length;
                setActivePlayerIndex(nextPlayerIndex);

                // Сбрасываем шаги у того игрока, который только что сходил
                return prev.map((p, idx) =>
                    idx === activePlayerIndex ? { ...p, stepsLeft: 0 } : p
                );
            });

            // 5. Возвращаем игру в фазу броска кубика, но уже для нового игрока
            setGamePhase('ROLL');
        }
    },[activePlayerIndex, gamePhase, isMovingAnimation, players]);

   

    useEffect(() => {
        const currentPlayer = players[activePlayerIndex];

        // Если сейчас ход компьютерного игрока
        if (currentPlayer && currentPlayer.isAI && !isMovingAnimation) {

            // БОТ ДЕЛАЕТ БРОСОК КУБИКА
            if (gamePhase === 'ROLL') {
                setTimeout(() => {
                    // Имитируем бросок (например, выпало случайное число)
                    const rolledNumber = Math.floor(Math.random() * 6) + 1;
                    handleDiceRollComplete(rolledNumber); // Вызываем вашу функцию завершения броска
                }, 1200); // Задержка 1.2 секунды для реалистичности
            }

            // БОТ ДЕЛАЕТ ХОД ПО КОРИДОРАМ
            // БОТ ДЕЛАЕТ ХОД ПО КОРИДОРАМ
            // ==========================================
// БОТ В ФАЗЕ ДВИЖЕНИЯ (MOVE)
// ==========================================
            if (gamePhase === 'MOVE') {
                setTimeout(() => {
                    const availableKeys = Object.keys(pathsData);

                    // ПРОВЕРКА: Если ходить действительно некуда
                    if (availableKeys.length === 0) {
                        setBotWasStuck(true); // Запоминаем, что бот застрял!
                        setGamePhase('ROTATE'); // Переходим к инженерии/пропуску
                        return;
                    }

                    setBotWasStuck(false); // Пути есть, всё в порядке

                    // Поиск сокровища или случайный выбор пути
                    const treasureTileKey = availableKeys.find(key => {
                        const [x, y] = key.split('-').map(Number);
                        return board[y][x].treasure !== null;
                    });

                    const finalTargetKey = treasureTileKey || availableKeys[Math.floor(Math.random() * availableKeys.length)];
                    animateRoute(finalTargetKey);

                }, 1000);
            }

// ==========================================
// БОТ В ФАЗЕ ВРАЩЕНИЯ (ROTATE)
// ==========================================
            if (gamePhase === 'ROTATE') {
                setTimeout(() => {

                    // Если флаг застревания активен — бот ПОЛНОСТЬЮ пропускает ход
                    if (botWasStuck) {
                        setBotWasStuck(false); // Сбрасываем флаг для следующего круга
                        setAvailableMoves([]);

                        // Переключаем ход на игрока
                        setPlayers(prev => {
                            const nextPlayerIndex = (activePlayerIndex + 1) % prev.length;
                            setActivePlayerIndex(nextPlayerIndex);
                            return prev.map((p, idx) => idx === activePlayerIndex ? { ...p, stepsLeft: 0 } : p);
                        });

                        setGamePhase('ROLL');
                        return; // Выходим из функции, ничего не вращая
                    }

                    // --- ОБЫЧНЫЙ ХОД БОТА (если он успешно походил и теперь крутит плитку) ---
                    const clickableTiles = [];
                    for (let y = 0; y < board.length; y++) {
                        for (let x = 0; x < board[y].length; x++) {
                            const distance = Math.abs(currentPlayer.x - x) + Math.abs(currentPlayer.y - y);
                            if (distance <= 1) {
                                clickableTiles.push({ x, y });
                            }
                        }
                    }

                    const randomTile = clickableTiles[Math.floor(Math.random() * clickableTiles.length)];
                    handleTileRotate(randomTile.x, randomTile.y);

                }, 1500);
            }
        }
    }, [gamePhase, activePlayerIndex, players, pathsData, isMovingAnimation, handleDiceRollComplete, animateRoute, board, handleTileRotate, botWasStuck]);


    useEffect(() => {
        window.addEventListener('resize', ()=>{
            setSize({width: window.innerWidth, height: window.innerHeight});
            setRatio((window.innerWidth + window.innerHeight) / rt);
        });
    }, []);
    
    return <div>
        <svg style={styles.main} width={size.width} height={size.height} viewBox={`${0} ${0} ${size.width / ratio} ${size.height / ratio}`}>
            <g>
                <rect width={"100%"} height={"100%"} fill={"#000"} />
            </g>

            <g transform={`translate(${offsetX}, ${offsetY})`} style={{ transition: 'transform 0.4s ease-in-out' }}>
            {board.map((item, i) => item.map((el)=> {
                const tileKey = `${el.x}-${el.y}`;
                const isHighlight =  gamePhase === 'MOVE' && !!pathsData[tileKey] && !isMovingAnimation;
                return<g onClick={() => {
                    if (players[activePlayerIndex].isAI) return; // ИИ ходит сам, клики заблокированы
                    if (isHighlight) animateRoute(tileKey);
                }}  key={`${el.x}-${el.y}`}>
                    <SpaseBase treasure={el.treasure}  type={el.type} translate={{x: el.x * 100, y: el.y * 100}}
                                rotation={el.rotation} onClick={handleTileRotate}/>
                    {isHighlight && (
                        <rect
                            x={el.x * 100}
                            y={el.y * 100}
                            width="100" height="100"
                            fill="#00F0FF" opacity="0.15"
                            stroke="#00F0FF" strokeWidth="3"
                            style={{ pointerEvents: 'none' }}
                        />
                    )}

                </g>

            }))}
            {players.map(player => (
                <g
                    key={player.id}
                    transform={`translate(${player.x * 100}, ${player.y * 100})`}
                    style={{ transition: 'transform 0.25s ease-in-out' }} // Плавное движение дроида
                >
                    <SpaceDroidToken color={player.color} />
                </g>
            ))}
            </g>
            <TopPanel players={players} />
            <SciFiDice x={size.width / ratio}  isRollAvailable={gamePhase === 'ROLL' && !players[activePlayerIndex].isAI} onRollComplete={handleDiceRollComplete}   />
            <g  onClick={() => {
                if (isMovingAnimation) return;
                setPathsData({}); // Прячем подсветку дорожек
                setGamePhase('ROTATE'); // Включаем режим инженерии (вращения)
            }} cursor={"pointer"}>
                <rect x={size.width / ratio - 65} y={51} width={60} height={20} fill={"#000"} stroke={"#A0DCE6"}  rx={5} strokeWidth={2} />
                <text x={size.width / ratio - 58} y={64} fill={"#e4a7c6"} fontSize={9} >Пропустить ход</text>
            </g>
        </svg>

        {gamePhase === 'MOVE' && !players[activePlayerIndex].isAI && (
            <button
                className="skip-turn-btn"
                onClick={() => {
                    if (isMovingAnimation) return;
                    setPathsData({}); // Прячем подсветку дорожек
                    setGamePhase('ROTATE'); // Включаем режим инженерии (вращения)
                }}
                style={{
                    padding: '10px 20px',
                    background: '#1F242D',
                    border: '2px solid #FF9900', // Оранжевый Sci-Fi акцент для предупреждения
                    color: '#FF9900',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                🛑 Остаться здесь
            </button>
        )}
    </div>

}

const styles = {
    main:{
        position: 'fixed',
        zIndex:10
    }
}