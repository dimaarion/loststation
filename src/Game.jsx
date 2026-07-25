import {useCallback, useEffect, useMemo, useState} from "react";
import {
    checkConnection,
    countTotalTreasures,
    findAvailablePaths,
    getCameraOffset,
    getRandomInt, treasurePlayerCount
} from "./action.js";
import SpaseBase from "./components/SpaseBase.jsx";
import {DroidSprite} from "./components/Players.jsx";
import {Planet, SciFiDice} from "./components/Objects.jsx";
import TopPanel from "./ui/TopPanel.jsx";
import {useSpring, animated} from '@react-spring/web';
import useStore from "./store.js";
import StartMenu from "./ui/StartMenu.jsx";
import GameOne from "./ui/GameOne.jsx";
import Btn from "./ui/Btn.jsx";
import DroneParams from "./ui/DroneParams.jsx";
import {pointInRect} from "./сollisions.js";
const MODES = {
    SINGLE: 'SINGLE',
    SPLIT: 'SPLIT',
    ASYNC_FRIEND: 'ASYNC_FRIEND',
    ASYNC_RANDOM: 'ASYNC_RANDOM',
};


export default function Game({mode = "SINGLE", maze = []}){
    const [pathsData, setPathsData] = useState({});
    const [isMovingAnimation, setIsMovingAnimation] = useState(false);
    const [availableMoves, setAvailableMoves] = useState([]);
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);
    const [board, setBoard] = useState(maze);
    const [droidCube, setDroidCube] = useState(0);
    const [skipMoveActive, setSkipMoveActive] = useState(false);
    const gamePhase = useStore((state) => state.gamePhase);
    const stars = useStore((state) => state.stars);
    const page = useStore((state) => state.page);
    const size = useStore((state) => state.size);
    const setSize = useStore((state) => state.setSize);
    const ratio = useStore((state) => state.ratio);
    const setRatio = useStore((state) => state.setRatio);
    const game = useStore((state) => state.game);
    const setGame = useStore((state) => state.setGame);
    const pause = useStore((state) => state.pause);


    useEffect(()=>{
        (()=>setBoard(maze))()
    },[maze])


    const { offsetX, offsetY } = getCameraOffset(
        game.players[activePlayerIndex].x,
        game.players[activePlayerIndex].y,
        size.width / ratio,
        size.height / ratio,
    );

    const handleDiceRollComplete = useCallback((result) => {
        const player = game.players[activePlayerIndex];
        // Находим все пути вдоль стен
        const paths = findAvailablePaths(player.x, player.y, result, board);
        setPathsData(paths);
        useStore.getState().setGamePhase('MOVE');
       return null
    },[game.players, activePlayerIndex, board]);

    const animateRoute = useCallback((targetKey) => {
        if (isMovingAnimation) return;

        const route = pathsData[targetKey]; // Например: [[0,0], [1,0], [1,1]] или [[0,0]] (если клик по себе)
        if (!route) return;

        // СЛУЧАЙ 1: Игрок никуда не идет (выпало 0 или кликнул на свою текущую клетку)
        if (route.length <= 1) {
            setPathsData({}); // Сбрасываем подсвеченные пути
            useStore.getState().setGamePhase('ROTATE'); // Сразу даем возможность вращать плитки вокруг себя
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
                useStore.getState().setGamePhase('ROTATE');
                return;
            }

            const [nextX, nextY] = route[currentStep];

            // Сдвигаем игрока на одну плитку вперёд по маршруту
            setGame({...game,
               players: game.players.map((p, idx) => {
                 return   idx === activePlayerIndex ? {...p, x: nextX, y: nextY, stepsLeft: Math.max(0, p.stepsLeft - 1)} : p
               })
            });

            // Проверяем и собираем сокровище на текущей промежуточной плитке
            setBoard(prevBoard =>
                prevBoard.map(row =>
                    row.map(tile => {
                        if( tile.x === nextX && tile.y === nextY && tile.treasure){
                            tile = {...tile, treasure: null, playerId:activePlayerIndex};
                        }
                        return tile
                        }
                    )
                )
            );


          
            currentStep++;

            // Если прошли весь маршрут до конца
            if (currentStep >= route.length) {
                clearInterval(movementInterval);
                setIsMovingAnimation(false);
                setPathsData({}); // Сбрасываем подсвеченные пути
                useStore.getState().setGamePhase('ROTATE'); // Переходим к вращению плиток
            }

        }, 1000); // Скорость шага дроида
    }, [isMovingAnimation, pathsData, setGame, game, activePlayerIndex]);

    const handleTileRotate = useCallback((targetX, targetY) => {

        // 1. Проверяем, что сейчас действительно фаза вращения и дроид не находится в движении
        if (gamePhase !== 'ROTATE' || isMovingAnimation) return;


        const currentPlayer = game.players[activePlayerIndex];

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
            setTimeout(()=>{
                setAvailableMoves([]); // На всякий случай очищаем подсветку
                setGame({...game,
                    players: game.players.map((p, idx) =>{
                        // Переключаем индекс активного игрока по кругу
                        const nextPlayerIndex = (activePlayerIndex + 1) % game.players.length;
                        setActivePlayerIndex(nextPlayerIndex);
                        return  idx === activePlayerIndex ? { ...p, stepsLeft: 0 } : p
                    })
                })
                

                // 5. Возвращаем игру в фазу броска кубика, но уже для нового игрока
                useStore.getState().setGamePhase('ROLL');
            },1000)

        }
    },[gamePhase, isMovingAnimation, game, activePlayerIndex, setGame]);



    useEffect(() => {
        if (mode !== MODES.SINGLE) return;
        const currentPlayer = game.players[activePlayerIndex];
        if (currentPlayer && currentPlayer.isAI && !isMovingAnimation) {

            // ==========================================
            // 1. БОТ ДЕЛАЕТ БРОСОК КУБИКА
            // ==========================================
            if (gamePhase === 'ROLL') {
                setTimeout(() => {
                    const rolledNumber = Math.floor(Math.random() * 6) + 1;
                    setDroidCube(rolledNumber);
                    handleDiceRollComplete(rolledNumber);
                }, 1200);
            }

            // ==========================================
            // 2. БОТ В ФАЗЕ ДВИЖЕНИЯ (MOVE)
            // ==========================================
            if (gamePhase === 'MOVE') {
                setTimeout(() => {
                    const availableKeys = Object.keys(pathsData);

                    if (availableKeys.length === 0) {
                        useStore.getState().setGamePhase('ROTATE');
                        return;
                    }

                    // Шаг A: Ищем все доступные клетки с сокровищами
                    const treasureKeys = availableKeys.filter(key => {
                        const [x, y] = key.split('-').map(Number);
                        return board[y]?.[x]?.treasure !== null;
                    });

                    let finalTargetKey = null;

                    if (treasureKeys.length > 0) {
                        // Если есть плитки с сокровищами, выбираем ту, до которой короче путь
                        finalTargetKey = treasureKeys.reduce((bestKey, currentKey) => {
                            const bestLength = pathsData[bestKey].length;
                            const currentLength = pathsData[currentKey].length;
                            return currentLength < bestLength ? currentKey : bestKey;
                        });
                    } else {
                        // Шаг B: Если сокровищ в зоне досягаемости нет, ищем ближайшее сокровище на всей карте
                        let allTreasures = [];
                        for (let y = 0; y < board.length; y++) {
                            for (let x = 0; x < board[y].length; x++) {
                                if (board[y][x].treasure !== null) {
                                    allTreasures.push({ x, y });
                                }
                            }
                        }

                        if (allTreasures.length > 0) {
                            // Для каждой доступной для шага клетки считаем минимальное расстояние до любого сокровища
                            let bestDist = Infinity;
                            availableKeys.forEach(key => {
                                const [targetX, targetY] = key.split('-').map(Number);

                                allTreasures.forEach(tr => {
                                    // Манхэттенское расстояние от конечной точки пути до сокровища
                                    const dist = Math.abs(targetX - tr.x) + Math.abs(targetY - tr.y);
                                    if (dist < bestDist) {
                                        bestDist = dist;
                                        finalTargetKey = key;
                                    }
                                });
                            });
                        }
                    }

                    // Резервный вариант: если сокровищ вообще не осталось на карте, ходим случайно
                    if (!finalTargetKey) {
                        finalTargetKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
                    }

                    animateRoute(finalTargetKey);
                }, 1000);
            }

            // ==========================================
            // 3. БОТ В ФАЗЕ ВРАЩЕНИЯ (ROTATE)
            // ==========================================
            // ==========================================
// БОТ В ФАЗЕ ВРАЩЕНИЯ (ROTATE)
// ==========================================
            if (gamePhase === 'ROTATE') {
                setTimeout(() => {
                    const botTile = board[currentPlayer.y]?.[currentPlayer.x];

                    // 1. Собираем все плитки, которые бот может вращать (расстояние <= 1)
                    const clickableTiles = [];
                    for (let y = 0; y < board.length; y++) {
                        for (let x = 0; x < board[y].length; x++) {
                            const distance = Math.abs(currentPlayer.x - x) + Math.abs(currentPlayer.y - y);
                            if (distance <= 1) {
                                clickableTiles.push(board[y][x]);
                            }
                        }
                    }

                    if (clickableTiles.length === 0) {
                        useStore.getState().setGamePhase('');
                        return;
                    }

                    let bestTileToRotate = null;


                    // Ищем ближайшее сокровище на карте, чтобы понять, куда вообще боту хочется идти
                    let nearestTreasure = null;
                    let minDistance = Infinity;
                    for (let y = 0; y < board.length; y++) {
                        for (let x = 0; x < board[y].length; x++) {
                            if (board[y][x].treasure !== null) {
                                const dist = Math.abs(currentPlayer.x - x) + Math.abs(currentPlayer.y - y);
                                if (dist < minDistance) {
                                    minDistance = dist;
                                    nearestTreasure = board[y][x];
                                }
                            }
                        }
                    }

                    // 2. СИМУЛЯЦИЯ: Пробуем вращать доступные плитки в "уме"
                    for (let tile of clickableTiles) {
                        // Пробуем 3 варианта поворота: +90, +180, +270
                        for (let rotationOffset of [90, 180, 270]) {
                            const simulatedRotation = (tile.rotation + rotationOffset) % 360;
                            const simulatedTile = { ...tile, rotation: simulatedRotation };

                            // Ситуация А: Если мы крутим соседнюю плитку
                            if (tile.x !== currentPlayer.x || tile.y !== currentPlayer.y) {
                                // Проверяем, соединит ли этот поворот бота с этой соседней плиткой
                                const connected = checkConnection(botTile, simulatedTile);

                                if (connected) {
                                    // Если на этой плитке лежит сокровище — это идеальный кандидат!
                                    if (tile.treasure !== null) {
                                        bestTileToRotate = tile;
                                        break;
                                    }

                                    // Если сокровище дальше, проверяем, приближает ли нас эта плитка к цели
                                    if (nearestTreasure) {
                                        const distFromConnectedToTreasure = Math.abs(tile.x - nearestTreasure.x) + Math.abs(tile.y - nearestTreasure.y);
                                        if (distFromConnectedToTreasure < minDistance) {
                                            bestTileToRotate = tile;
                                        }
                                    }
                                }
                            }
                            // Ситуация Б: Если бот крутит плитку под самим собой
                            else {
                                // Проверяем, с какими соседями соединит бота его собственный поворот
                                for (let neighbor of clickableTiles) {
                                    if (neighbor.x === currentPlayer.x && neighbor.y === currentPlayer.y) continue;

                                    const connected = checkConnection(simulatedTile, neighbor);
                                    // Если поворот открывает проход к соседу с сокровищем
                                    if (connected && neighbor.treasure !== null) {
                                        bestTileToRotate = tile;
                                        break;
                                    }
                                }
                            }
                        }
                        if (bestTileToRotate) break; // Нашли отличное решение, прекращаем поиск
                    }

                    // 3. ЭВРИСТИКА-ВРЕДИТЕЛЬ (если себе открыть путь не получается, мешаем человеку)
                    if (!bestTileToRotate) {
                        const humanPlayer = game.players.find(p => !p.isAI);
                        if (humanPlayer) {
                            const humanTile = board[humanPlayer.y]?.[humanPlayer.x];

                            // Ищем плитку рядом с человеком, которую мы можем повернуть, чтобы сломать ему проход
                            const tileToSabotage = clickableTiles.find(tile => {
                                const isBotOwnTile = tile.x === currentPlayer.x && tile.y === currentPlayer.y;
                                if (isBotOwnTile) return false;

                                // Проверяем, соединен ли сейчас человек с этой плиткой
                                const isConnectedToHumanNow = checkConnection(humanTile, tile);
                                if (isConnectedToHumanNow) {
                                    // Если мы её повернем, связь прервется — это отличная диверсия!
                                    return true;
                                }
                                return false;
                            });

                            if (tileToSabotage) {
                                bestTileToRotate = tileToSabotage;
                            }
                        }
                    }

                    // 4. ДЕФОЛТНЫЙ ВЫБОР (если умных ходов нет, крутим случайную соседнюю плитку, но не под собой)
                    if (!bestTileToRotate) {
                        const safeTiles = clickableTiles.filter(t => !(t.x === currentPlayer.x && t.y === currentPlayer.y));
                        const pool = safeTiles.length > 0 ? safeTiles : clickableTiles;
                        bestTileToRotate = pool[Math.floor(Math.random() * pool.length)];
                    }

                    // Физически поворачиваем выбранную плитку в игре
                    handleTileRotate(bestTileToRotate.x, bestTileToRotate.y);
                    useStore.getState().setGamePhase('');

                }, 1500);
            }
        }
    }, [gamePhase, activePlayerIndex, game.players, pathsData, isMovingAnimation, handleDiceRollComplete, animateRoute, board, handleTileRotate, mode]);


    useEffect(() => {
        window.addEventListener('resize', ()=>{
            setSize({width: window.innerWidth, height: window.innerHeight});
            setRatio((window.innerWidth + window.innerHeight) / 1000);
            useStore.getState().setStars(new Array(window.innerWidth).fill(true).map(()=>{
                return  {
                    position:{
                        x: getRandomInt(0, window.innerWidth), y: getRandomInt(0, window.innerHeight)
                    },
                    width:getRandomInt(0, 50),
                    height:getRandomInt(0, 50),
                    scale:getRandomInt(0, 100),
                };

            }))
        });
    }, []);

    const count = useMemo(()=>{
       return countTotalTreasures(board);
    },[board])

    const countTotal = useMemo(()=>{
        return countTotalTreasures(maze);
    },[maze])
    




    const  translateCam  = useSpring({
        // Центрируем камеру относительно ТЕКУЩИХ анимированных координат дроида!
        // Мы привязываем камеру к droidX.goal / droidY.goal или напрямую к targetX/targetY,
        // но с более низкой жесткостью (tension), чтобы камера плавно "догоняла" дроида.
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        config: {
            friction: 22   // Без резких колебаний
        }
    });

    const [rotateBtnBot] = useSpring(()=>({
        from: {transform:'rotate(0deg) translate(-50px, -50px)'},
        to: {transform:'rotate(360deg) translate(-50px, -50px)'},
        reset:true,
        config: {duration:500}
    }),[droidCube])




    return <div>
        <svg xmlns="http://www.w3.org/2000/svg" style={styles.main} width={size.width} height={size.height} viewBox={`${0} ${0} ${size.width / ratio} ${size.height / ratio}`}>
            <g>

                <rect width={"100%"} height={"100%"} fill={"#000"} />
                {stars.map((el,i)=> <g key={i + "star"} transform={`translate(${el.position.x} ${el.position.y}) scale(${el.scale / 300})`} width={50} height={50}>
                    <defs>
                        <filter colorInterpolationFilters="sRGB" x="-18" y="-18" width="20" height="20" id="filter_1">
                            <feFlood floodOpacity="0" result="BackgroundImageFix_1" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix_1" result="Shape_2" />
                            <feGaussianBlur stdDeviation="5" />
                        </filter>
                        <filter colorInterpolationFilters="sRGB" x="-50" y="-50" width="100" height="100" id="filter_active_player_1">
                            <feFlood floodOpacity="0" result="BackgroundImageFix_1" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix_1" result="Shape_2" />
                            <feGaussianBlur stdDeviation="5" />
                        </filter>
                        <linearGradient id="gradient_btn_1" gradientUnits="userSpaceOnUse" x1="338.162" y1="48.202" x2="0.162" y2="48.202">
                            <stop offset="0" stopColor="#2D5E6B"/>
                            <stop offset="0.49" stopColor="#29A1AB"/>
                            <stop offset="1" stopColor="#2D5E6B"/>
                        </linearGradient>
                        <radialGradient id="gradient_btn_2" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"
                                        gradientTransform="matrix(0 48.763 -168.834 0 168.834 48.763)">
                            <stop offset="0" stopColor="#871E1E"/>
                            <stop offset="1" stopColor="#24C2C9"/>
                        </radialGradient>
                        <filter colorInterpolationFilters="sRGB" x="-155" y="-85" width="157" height="87" id="filter_btn_3">
                            <feFlood floodOpacity="0" result="BackgroundImageFix_btn_1"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" in="SourceAlpha"/>
                            <feOffset dx="0" dy="4"/>
                            <feGaussianBlur stdDeviation="2"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.251 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix_btn_1" result="Shadow_btn_2"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="Shadow_btn_2" result="Shape_btn_3"/>
                        </filter>
                        <filter id="blurFilter_btn">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="8"/>
                        </filter>


                        <linearGradient id="gradient_btn_hover_1" gradientUnits="userSpaceOnUse" x1="338.162" y1="48.202" x2="0.162" y2="48.202">
                            <stop offset="0" stopColor="#4C495C" />
                            <stop offset="0.49" stopColor="#391FC4" />
                            <stop offset="1" stopColor="#4C495C" />
                        </linearGradient>
                        <radialGradient id="gradient_btn_hover_2" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="matrix(0 29.1 -100.755 0 100.755 29.1)">
                            <stop offset="0" stopColor="#871E1E" />
                            <stop offset="1" stopColor="#B9B1E0" />
                        </radialGradient>

                        <filter colorInterpolationFilters="sRGB" x="-182.065" y="-35.059" width="184.065" height="37.059" id="filter_btn_hover_3">
                            <feFlood floodOpacity="0" result="BackgroundImageFix_1" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" in="SourceAlpha" />
                            <feOffset dx="0" dy="4" />
                            <feGaussianBlur stdDeviation="2" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.251 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix_btn_hover_1" result="Shadow_btn_hover_2" />
                            <feBlend mode="normal" in="SourceGraphic" in2="Shadow_btn_hover_btn_hover_2" result="Shape_btn_hover_3" />
                        </filter>
                    </defs>
                    <path d="M0 10C0 4.47716 4.47716 0 10 0C15.5228 0 20 4.47716 20 10C20 15.5228 15.5228 20 10 20C4.47716 20 0 15.5228 0 10Z" fill="#FFFFFF" fillRule="evenodd" filter="url(#filter_1)" transform="translate(15 15)" />
                </g>)}
                <Planet />
                {page === "game_play"?<animated.g style={translateCam}>
                    <rect x={-10} y={-10} width={board.length * 100 + 10} height={board.length * 100 + 10}
                          fill={"#373A40"}/>
                </animated.g>:""}
            </g>
            {page === "game_play"? <svg>
                <animated.g style={translateCam}>
                    <g>
                        {board.map((item) => item.filter((f)=>pointInRect({x:f.x * 100,y:f.y * 100},{
                            x: (game.players[activePlayerIndex].x * 100) - size.width / 2,
                            y:(game.players[activePlayerIndex].y * 100) - size.height / 2,
                            width:size.width,
                            height:size.height,
                        })).map((el) => {
                            const tileKey = `${el.x}-${el.y}`;
                            const isHighlight = gamePhase === 'MOVE' && !!pathsData[tileKey] && !isMovingAnimation;
                            return <g onClick={() => {
                                if (game.players[activePlayerIndex].isAI) return; // ИИ ходит сам, клики заблокированы
                                if (isHighlight) animateRoute(tileKey);
                            }} key={`${el.x}-${el.y}`}>
                                <SpaseBase player={game.players[activePlayerIndex]} treasure={el.treasure} type={el.type}
                                           translate={{x: el.x * 100, y: el.y * 100}}
                                           rotation={el.rotation} onClick={handleTileRotate}/>
                                {isHighlight && (
                                    <rect
                                        x={el.x * 100}
                                        y={el.y * 100}
                                        width="100" height="100"
                                        fill="#00F0FF" opacity="0.15"
                                        stroke="#00F0FF" strokeWidth="3"
                                        style={{pointerEvents: 'none'}}
                                    />
                                )}

                            </g>

                        }))}
                        {game.players.map((player,idx) =><g>
                            <DroidSprite key={player.id}
                                         x={player.x}
                                         y={player.y}
                                         type={player.type}
                                         treasure={treasurePlayerCount(board, idx)}
                                         name={player.name}
                                         color={player.color}
                                         skipMoveActive={activePlayerIndex === idx}
                            />



                                    </g>)}
                    </g>
                </animated.g>

            </svg>:""}
            {page === "game_play"?<TopPanel droidCube={droidCube} currentIndex={activePlayerIndex} countTotal={countTotal} count={count} players={game.players}/>:""}
            {page === "game_play" && !pause?game.players[activePlayerIndex].isAI?<svg x={size.width / ratio - 70} width={50} height={50} viewBox={"0 0 100 100"}>
                <g transform={'translate(50 50)'}>
                    <animated.g style={rotateBtnBot}>
                        <polygon
                            points="50,15 85,32 85,68 50,85 15,68 15,32"
                            fill="#1F242D"
                            stroke={"#00F0FF"}
                            strokeWidth="3"
                            filter={"url(#neon-glow)"}
                        />
                    </animated.g>

                    <text x={0} y={0}  textAnchor="middle"
                           dominantBaseline="middle"
                           fill={"#00F0FF"}
                           fontSize="26"
                           fontWeight="bold"
                           fontFamily="monospace"
                           style={{ letterSpacing: '1px' }}>{droidCube}</text>
                </g>


            </svg>:<SciFiDice x={size.width / ratio - 70}
                        isRollAvailable={gamePhase === 'ROLL' && !game.players[activePlayerIndex].isAI}
                        onRollComplete={handleDiceRollComplete}/>:""}
            {gamePhase === 'MOVE' && !game.players[activePlayerIndex].isAI && (<g transform={`translate(${size.width / ratio - 80} 30)`} onClick={() => {
                setSkipMoveActive(true)
                setTimeout(()=>{
                    if (isMovingAnimation) return;
                    setPathsData({}); // Прячем подсветку дорожек
                    useStore.getState().setGamePhase('ROTATE'); // Включаем режим инженерии (вращения)
                    setSkipMoveActive(false)
                },500)
            }} cursor={"pointer"}>
                <Btn scale={0.2} y={0} tx={20} ty={155} x={0} text={"Пропустить ход"} fontSize={60}/>
            </g>)}
            {page === "start_menu"?<g transform={`translate(-150 0)`}>
                <StartMenu/>
            </g>:""}
            {page === "game_one"?<GameOne height={size.height} width={size.width} ratio={ratio} />:""}
            {page === "drone_settings"?<DroneParams height={size.height} width={size.width} ratio={ratio} />:""}
        </svg>
    </div>

}

const styles = {
    main:{
        position: 'fixed',
        zIndex:10
    },
    skip_move:{
        transition: '0.5s',
    }
}