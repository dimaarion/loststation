import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    checkConnection,
    countTotalTreasures,
    findAvailablePaths,
    getCameraOffset,
    getCompletionCredits,
    getCreditPerTreasure,
    getObjectivesTarget,
    getPlayersPoint,
    getQuestTargetType,
    getRandomInt,
} from "./action.js";
import SpaseBase from "./components/SpaseBase.jsx";
import {DroidSprite} from "./components/Players.jsx";
import {Planet, SciFiDice} from "./components/Objects.jsx";
import TopPanel from "./ui/TopPanel.jsx";
import {useSpring, animated, to} from '@react-spring/web';
import useStore from "./store.js";
import StartMenu from "./ui/StartMenu.jsx";
import GameOne from "./ui/GameOne.jsx";
import Btn from "./ui/Btn.jsx";
import DroneParams from "./ui/DroneParams.jsx";
import {pointInRect} from "./сollisions.js";
import Victory from "./ui/Victory.jsx";
import MessageLevel from "./ui/MessageLevel.jsx";
const MODES = {
    SINGLE: 'SINGLE',
    SPLIT: 'SPLIT',
    ASYNC_FRIEND: 'ASYNC_FRIEND',
    ASYNC_RANDOM: 'ASYNC_RANDOM',
};


export default function Game({mode = "SINGLE", maze = []}){
    const consecutiveSkipsRef = useRef(0);
    const isBotActingRef = useRef(false);
    const playerRotateRef = useRef(false);
    const camDirectionRef = useRef(null);
    const [pathsData, setPathsData] = useState({});
    const [isMovingAnimation, setIsMovingAnimation] = useState(false);
    const [availableMoves, setAvailableMoves] = useState([]);
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);
    const [board, setBoard] = useState(maze);
    const [droidCube, setDroidCube] = useState(0);
    const [moveCamera, setMoveCamera] = useState({x:0,y:0});
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
    const pointsGame = useStore((state) => state.pointsGame);
    const setPointsGame = useStore((state)=>state.setPointsGame)
    const numberMoves = useStore((state) => state.numberMoves);
    const quests = useStore((state) => state.quests);
    const questTarget = useStore((state) => state.questTarget);

// 1. Создаем пружину для смещения ручной камеры
    const [{ camX, camY }, camApi] = useSpring(() => ({
        camX: 0,
        camY: 0,
        config: { tension: 120, friction: 14 } // Настройка мягкости / скорости сдвига
    }));

// 2. Храним текущий вектор направления смещения (dx: -1..1, dy: -1..1)
    const moveDirectionRef = useRef({ x: 0, y: 0 });
    const moveIntervalRef = useRef(null);
    const targetCamRef = useRef({ x: 0, y: 0 });


    useEffect(()=>{
        (()=>setBoard(maze))()
    },[maze])


    useEffect(() => {
        if(gamePhase === "ROLL"){
            useStore.getState().setMessage("Ходит: " + game.players[activePlayerIndex].type)
        }else {
            useStore.getState().setMessage("Ходов сделано: " + numberMoves)
        }
       
        
    }, [activePlayerIndex, game.players, gamePhase, numberMoves]);
    


    const { offsetX, offsetY } = getCameraOffset(
        game.players[activePlayerIndex]?.x,
        game.players[activePlayerIndex]?.y,
        size.width / ratio,
        size.height / ratio,
    );

    const handleDiceRollComplete = useCallback((result) => {
        const player = game.players[activePlayerIndex];
        // Находим все пути вдоль стен
        const paths = findAvailablePaths(player.x, player.y, result, board);

        setPathsData(paths);
        setTimeout(() => {
            useStore.getState().setGamePhase("MOVE");

        }, 0);
       return null
    },[game.players, activePlayerIndex, board]);

    const animateRoute = useCallback((targetKey) => {
        if (isMovingAnimation) return;
        const route = pathsData[targetKey]; // Например: [[0,0], [1,0], [1,1]] или [[0,0]] (если клик по себе)
        if (!route) return;
        camDirectionRef.current = "MOVE"
        // СЛУЧАЙ 1: Игрок никуда не идет (выпало 0 или кликнул на свою текущую клетку)
        if (route.length <= 1) {
            setPathsData({}); // Сбрасываем подсвеченные пути
            useStore.getState().setGamePhase('ROTATE');
            camDirectionRef.current = null
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
                camDirectionRef.current = null
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
                            setTimeout(()=>{
                                setPointsGame(activePlayerIndex)
                                if(activePlayerIndex === 0){
                                    useStore.getState().setCredits(getCreditPerTreasure(quests,game))
                                }

                                if(getQuestTargetType(quests,game) === tile.treasure && activePlayerIndex === 0){
                                    if(questTarget === getObjectivesTarget(quests,game) - 1){
                                        useStore.getState().setCredits(getCompletionCredits(quests,game))
                                    }
                                    useStore.getState().setQuestTarget()

                                }

                            },0)

                            return { ...tile, treasure: null, playerId: activePlayerIndex };
                        }
                        return tile
                        }
                    )
                )
            );

           if(activePlayerIndex === 0)useStore.getState().setNumberMoves();
            currentStep++;

            // Если прошли весь маршрут до конца
            if (currentStep >= route.length) {
                clearInterval(movementInterval);
                setIsMovingAnimation(false);
                setPathsData({}); // Сбрасываем подсвеченные пути
                useStore.getState().setGamePhase('ROTATE'); // Переходим к вращению плиток
            }

        }, 1000); // Скорость шага дроида
        return ()=>clearInterval(movementInterval)
    }, [isMovingAnimation, pathsData, setGame, game, activePlayerIndex, setPointsGame, quests, questTarget]);

    const handleTileRotate = useCallback((targetX, targetY) => {
        if(playerRotateRef.current)return;
        // 1. Проверяем, что сейчас действительно фаза вращения и дроид не находится в движении
        if (gamePhase !== 'ROTATE' || isMovingAnimation) return;

        playerRotateRef.current = true
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
                playerRotateRef.current = false
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




    // УМНЫЙ ИИ С ПРИНУДИТЕЛЬНЫМ ДВИЖЕНИЕМ ПРИ 2 ПРОПУСКАХ
    // ==========================================
    useEffect(() => {
        if (mode !== MODES.SINGLE) return;
        const currentPlayer = game.players[activePlayerIndex];
        if (!currentPlayer || !currentPlayer.isAI || isMovingAnimation) return;

        // 1. ФАЗА БРОСКА КУБИКА (ROLL)
        if (gamePhase === 'ROLL') {
            isBotActingRef.current = false; // Сбрасываем блокировку для нового хода
            const timer = setTimeout(() => {
                const rolledNumber = Math.floor(Math.random() * 6) + 1;
                setDroidCube(rolledNumber);
                handleDiceRollComplete(rolledNumber);
            }, 800);
            return () => clearTimeout(timer);
        }

        // 2. ФАЗА ДВИЖЕНИЯ (MOVE)
        if (gamePhase === 'MOVE') {
            const timer = setTimeout(() => {
                const availableKeys = Object.keys(pathsData);
                const currentKey = `${currentPlayer.x}-${currentPlayer.y}`;

                if (availableKeys.length === 0) {
                    consecutiveSkipsRef.current += 1; // Учитываем пропуск, если физически нет путей
                    useStore.getState().setGamePhase('ROTATE');

                    return;
                }

                // Доступные варианты движения (без текущей клетки)
                const moveOptions = availableKeys.filter(k => k !== currentKey);

                // Если альтернативных вариантов нет вообще
                if (moveOptions.length === 0) {
                    consecutiveSkipsRef.current += 1;
                    setPathsData({});
                    useStore.getState().setGamePhase('ROTATE');

                    return;
                }

                // --- ПРОВЕРКА: ЕСЛИ УЖЕ 2 ХОДА НЕТ ДВИЖЕНИЯ — ОБЯЗАН ИДТИ ---
                const isForcedToMove = consecutiveSkipsRef.current >= 2;

                // Шаг А: Проверяем, есть ли прямой путь до сокровища
                const treasureKeys = moveOptions.filter(key => {
                    const [x, y] = key.split('-').map(Number);
                    return board[y]?.[x]?.treasure !== null;
                });

                let chosenKey = null;

                if (treasureKeys.length > 0) {
                    // Выбираем кратчайший маршрут к сокровищу
                    chosenKey = treasureKeys.reduce((best, curr) =>
                        pathsData[curr].length < pathsData[best].length ? curr : best
                    );
                } else {
                    // Шаг Б: Ищем ближайшее сокровище на всей карте
                    let nearestTreasure = null;
                    let minDist = Infinity;

                    board.forEach(row => {
                        row.forEach(tile => {
                            if (tile.treasure !== null) {
                                const dist = Math.abs(currentPlayer.x - tile.x) + Math.abs(currentPlayer.y - tile.y);
                                if (dist < minDist) {
                                    minDist = dist;
                                    nearestTreasure = tile;
                                }
                            }
                        });
                    });

                    if (nearestTreasure) {
                        let bestDist = minDist;
                        moveOptions.forEach(key => {
                            const [tx, ty] = key.split('-').map(Number);
                            const distToTr = Math.abs(tx - nearestTreasure.x) + Math.abs(ty - nearestTreasure.y);

                            // Выбираем клетку, приближающую к сокровищу
                            if (distToTr < bestDist) {
                                bestDist = distToTr;
                                chosenKey = key;
                            }
                        });
                    }

                    // Если целевого приближения нет, НО БОТ ОБЯЗАН ИДТИ (isForcedToMove === true)
                    // выбираем самый длинный доступный маршрут, чтобы не застаиваться
                    if (!chosenKey && isForcedToMove) {
                        chosenKey = moveOptions.reduce((best, curr) =>
                            pathsData[curr].length > pathsData[best].length ? curr : best
                        );
                    }
                }

                // --- ПРИНЯТИЕ РЕШЕНИЯ И СБРОС/УВЕЛИЧЕНИЕ СЧЁТЧИКА ---
                if (chosenKey) {
                    consecutiveSkipsRef.current = 0; // Сбрасываем счётчик, так как бот совершает движение!
                    animateRoute(chosenKey);
                } else {
                    consecutiveSkipsRef.current += 1; // Увеличиваем счётчик пропусков
                    setPathsData({});
                    useStore.getState().setGamePhase('ROTATE');

                }

            }, 800);
            return () => clearTimeout(timer);
        }

        // 3. ФАЗА ВРАЩЕНИЯ (ROTATE)
        if (gamePhase === 'ROTATE') {
            // Если бот уже принял решение в этой фазе — игнорируем повторные срабатывания useEffect
            if (isBotActingRef.current) return;

            // Ставим блок на повторные вызовы
            isBotActingRef.current = true;

            const timer = setTimeout(() => {
                const clickableTiles = [];
                for (let y = 0; y < board.length; y++) {
                    for (let x = 0; x < board[y].length; x++) {
                        const dist = Math.abs(currentPlayer.x - x) + Math.abs(currentPlayer.y - y);
                        if (dist <= 1) clickableTiles.push(board[y][x]);
                    }
                }

                if (clickableTiles.length === 0) {
                    isBotActingRef.current = false;
                    return;
                }

                let bestTileToRotate = null;
                let foundDirectTreasurePath = false;

                const treasures = [];
                board.forEach(row => {
                    row.forEach(tile => {
                        if (tile.treasure !== null) treasures.push(tile);
                    });
                });

                // Проверяем все варианты вращения (включая плитку ПОД СОБОЙ)
                for (let tile of clickableTiles) {
                    for (let angle of [90, 180, 270]) {
                        const simRotation = (tile.rotation + angle) % 360;

                        const simBoard = board.map(row =>
                            row.map(t => (t.x === tile.x && t.y === tile.y ? { ...t, rotation: simRotation } : t))
                        );

                        const currentBotTile = simBoard[currentPlayer.y][currentPlayer.x];

                        for (let tr of treasures) {
                            const trTile = simBoard[tr.y][tr.x];
                            if (Math.abs(currentPlayer.x - tr.x) + Math.abs(currentPlayer.y - tr.y) <= 1) {
                                if (checkConnection(currentBotTile, trTile)) {
                                    bestTileToRotate = tile;
                                    foundDirectTreasurePath = true;
                                    break;
                                }
                            }
                        }

                        if (foundDirectTreasurePath) break;
                    }
                    if (foundDirectTreasurePath) break;
                }

                // Эвристика поиска наиболее выгодного поворота
                if (!bestTileToRotate && treasures.length > 0) {
                    const nearestTr = treasures.reduce((best, curr) => {
                        const d1 = Math.abs(currentPlayer.x - best.x) + Math.abs(currentPlayer.y - best.y);
                        const d2 = Math.abs(currentPlayer.x - curr.x) + Math.abs(currentPlayer.y - curr.y);
                        return d2 < d1 ? curr : best;
                    });

                    let maxConnections = -1;

                    for (let tile of clickableTiles) {
                        for (let angle of [90, 180, 270]) {
                            const simRotation = (tile.rotation + angle) % 360;
                            const simTile = { ...tile, rotation: simRotation };

                            let connCount = 0;
                            clickableTiles.forEach(neighbor => {
                                if (neighbor.x === tile.x && neighbor.y === tile.y) return;
                                if (checkConnection(simTile, neighbor)) {
                                    connCount++;
                                    const distToTr = Math.abs(neighbor.x - nearestTr.x) + Math.abs(neighbor.y - nearestTr.y);
                                    if (distToTr < Math.abs(currentPlayer.x - nearestTr.x) + Math.abs(currentPlayer.y - nearestTr.y)) {
                                        connCount += 2;
                                    }
                                }
                            });

                            if (connCount > maxConnections) {
                                maxConnections = connCount;
                                bestTileToRotate = tile;
                            }
                        }
                    }
                }

                // Резерв — крутим плитку под собой
                if (!bestTileToRotate) {
                    bestTileToRotate = board[currentPlayer.y][currentPlayer.x];
                }

                handleTileRotate(bestTileToRotate.x, bestTileToRotate.y);

            }, 800);

            return () => clearTimeout(timer);
        }
    }, [gamePhase, activePlayerIndex, game.players, pathsData, isMovingAnimation, handleDiceRollComplete, animateRoute, board, handleTileRotate, mode]);
    // ... Оставшаяся часть рендера (JSX) остается без изменений ...

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



    // 3. Запуск / Остановка цикла при зажатии кнопок
    const startCamMove = useCallback((dx, dy) => {
        moveDirectionRef.current = { x: dx, y: dy };

        if (!moveIntervalRef.current) {
            moveIntervalRef.current = setInterval(() => {
                const { x, y } = moveDirectionRef.current;
                if (x === 0 && y === 0) return;

                // Инкрементируем численные значения в ref
                targetCamRef.current.x += x;
                targetCamRef.current.y += y;

                // Передаем прямые числа в пружину
                camApi.start({
                    camX: targetCamRef.current.x,
                    camY: targetCamRef.current.y,
                });
            }, 16);
        }
    }, [camApi]);

    const stopCamMove = useCallback(() => {
        moveDirectionRef.current = { x: 0, y: 0 };
        if (moveIntervalRef.current) {
            clearInterval(moveIntervalRef.current);
            moveIntervalRef.current = null;
        }
    }, []);

// При изменении фазы на MOVE сбрасываем ручной сдвиг камеры в 0
    useEffect(() => {

        if (gamePhase === "MOVE") {
            targetCamRef.current = { x: 0, y: 0 };
            camApi.start({ camX: 0, camY: 0 });
        }
    }, [gamePhase, camApi]);



    const  tileRotate  = useSpring({
        from:{transform:"rotate(0deg)"},
        to:[{transform:"rotate(360deg)"}],
        loop:true,
        config: {
            duration:5000
        }
    });
    useEffect(() => {
        if(gamePhase === "MOVE"){
            camDirectionRef.current = "MOVE"
        }else {
            camDirectionRef.current = null
        }
    }, [gamePhase]);

    return <div>
        <svg xmlns="http://www.w3.org/2000/svg" style={styles.main} width={size.width} height={size.height} viewBox={`${0} ${0} ${size.width / ratio} ${size.height / ratio}`}>
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
            <g>
                <rect width={"100%"} height={"100%"} fill={"#000"} />
                {stars.map((el,i)=> <g key={i + "star"} transform={`translate(${el.position.x} ${el.position.y}) scale(${el.scale / 300})`} width={50} height={50}>
                    <path d="M0 10C0 4.47716 4.47716 0 10 0C15.5228 0 20 4.47716 20 10C20 15.5228 15.5228 20 10 20C4.47716 20 0 15.5228 0 10Z" fill="#FFFFFF" fillRule="evenodd" filter="url(#filter_1)" transform="translate(15 15)" />
                </g>)}
                <Planet />
                {page === "game_play"?<animated.g style={{
                    transform: to(
                        [camX, camY],
                        (x, y) => `translate(${x}px, ${y}px)`
                    )
                }}><animated.g style={translateCam}>
                    <rect x={-10} y={-10} width={board.length * 100 + 20} height={board.length * 100 + 20}
                          fill={"#373A40"}/>
                </animated.g></animated.g>:""}
            </g>
            {page === "game_play"?
                <animated.g style={{
                    transform: to(
                        [camX, camY],
                        (x, y) => `translate(${x}px, ${y}px)`
                    )
                }}>
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
                                    <SpaseBase tileRotate={tileRotate} player={game.players[activePlayerIndex]} treasure={el.treasure} type={el.type}
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
                            {game.players.map((player,idx) =><g key={player.id + "droid-sprite"}>

                                {getPlayersPoint(game, activePlayerIndex, player) === 1?<DroidSprite
                                    x={player.x}
                                    y={player.y}
                                    type={player.type}
                                    treasure={pointsGame.filter((tre) => tre === idx).length}
                                    name={player.name}
                                    color={player.color}
                                    skipMoveActive={activePlayerIndex === idx}
                                />:<svg x={player.x * 100} y={player.y * 100} width={100} height={100} viewBox={`0 0 200 200`}>
                                    {game.players.filter((f)=>f?.x === player.x && f?.y === player.y).map((p,id) =><g key={p.id + "droid-sprite-box"}>
                                        <DroidSprite
                                            x={id % 3} // столбец (0,1,2)
                                            y={Math.floor(id / 3)} // строка (увеличивается каждые 3 игрока)
                                            type={p.type}
                                            treasure={pointsGame.filter((tre) => tre === id).length}
                                            name={p.name}
                                            color={p.color}
                                            skipMoveActive={false}
                                        />
                                    </g>)}
                                </svg>}

                            </g>)}
                        </g>
                    </animated.g>
                </animated.g>


           :""}
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
            }}>
                <Btn scale={0.2} y={0} tx={20} ty={155} x={0} text={"Пропустить ход"} fontSize={60}/>
            </g>)}
            {page === "start_menu"?<g transform={`translate(-150 0)`}>
                <StartMenu/>
            </g>:""}
            {page === "game_one"?<GameOne height={size.height} width={size.width} ratio={ratio} />:""}
            {page === "drone_settings"?<DroneParams height={size.height} width={size.width} ratio={ratio} />:""}
            {count === 0?<Victory/>:""}
            {page === "game_play" && !pause?<g>
                {/* Стрелка Вправо */}
                <g
                    onPointerDown={() => startCamMove(-5, 0)}
                    onPointerUp={stopCamMove}
                    onPointerLeave={stopCamMove}
                    transform={`translate(${size.width / ratio - 19} ${size.height / ratio / 2 - 15}) scale(0.3)`}
                >
                    <path style={styles.arrow} className={"box"} d="M30.5 0L61 53L0 53L30.5 0Z" fill={"#2C6C78"} fillRule="evenodd" strokeWidth="4" stroke="#A7EAF2" transform="matrix(0 1 -1 0 55 2)"/>
                </g>

                {/* Стрелка Влево */}
                <g
                    onPointerDown={() => startCamMove(5, 0)}
                    onPointerUp={stopCamMove}
                    onPointerLeave={stopCamMove}
                    transform={`translate(0 ${size.height / ratio / 2 - 15}) scale(0.3) rotate(-180 30 30)`}
                >
                    <path style={styles.arrow} className={"box"} d="M30.5 0L61 53L0 53L30.5 0Z" fill="#2C6C78" fillRule="evenodd" strokeWidth="4" stroke="#A7EAF2" transform="matrix(0 1 -1 0 55 2)"/>
                </g>

                {/* Стрелка Вверх */}
                <g
                    onPointerDown={() => startCamMove(0, 5)}
                    onPointerUp={stopCamMove}
                    onPointerLeave={stopCamMove}
                    transform={`translate(${size.width / ratio / 2 - 15} ${50}) scale(0.3) rotate(-90 30 30)`}
                >
                    <path style={styles.arrow} className={"box"} d="M30.5 0L61 53L0 53L30.5 0Z" fill="#2C6C78" fillRule="evenodd" strokeWidth="4" stroke="#A7EAF2" transform="matrix(0 1 -1 0 55 2)"/>
                </g>

                {/* Стрелка Вниз */}
                <g
                    onPointerDown={() => startCamMove(0, -5)}
                    onPointerUp={stopCamMove}
                    onPointerLeave={stopCamMove}
                    transform={`translate(${size.width / ratio / 2 - 15} ${size.height / ratio - 19}) scale(0.3) rotate(90 30 30)`}
                >
                    <path style={styles.arrow} className={"box"} d="M30.5 0L61 53L0 53L30.5 0Z" fill="#2C6C78" fillRule="evenodd" strokeWidth="4" stroke="#A7EAF2" transform="matrix(0 1 -1 0 55 2)"/>
                </g>
                {game.type === "game-passing"?<MessageLevel/>:""}
            </g>:""}

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
    },
    arrow:{
        transition:"0.2s"
    },
    cam:{

    }
}