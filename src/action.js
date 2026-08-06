export function routable(n) {
    return Math.PI / 180 * n;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Генерирует массив сокровищ для уровня
 * @param {number} count - сколько сокровищ нужно создать
 * @param {number} gridSize - размер сетки
 * @param fixedTreasures
 * @returns {Array<{x: number, y: number, type: string}>}
 */
const generateTreasuresList = (count, gridSize, fixedTreasures = {}) => {
    const treasures = [];

    // 1. Фильтруем типы: исключаем те сокровища, у которых в fixedTreasures количество установлено в 0
    const allTypes = [
        'energy_core',
        'generator',
        'Gravity Booster',
        'alien_artifact',
        'Quantum Wrench',
        'Void Radar',
        'Plasma Cutter',
        'leg-data',
        'nav_chip'
    ];
    const randomPoolTypes = allTypes.filter(type => fixedTreasures[type] !== 0);

    // Размеры сетки
    const finalCount = Math.max(1, count);
    const maxAvailableCells = (gridSize - 2) * (gridSize - 2);
    const safeCount = Math.min(finalCount, maxAvailableCells);

    // Вспомогательная функция для безопасного добавления позиций
    const addTreasure = (type) => {
        let added = false;
        let attempts = 0;

        while (!added && attempts < 100) {
            attempts++;
            const x = Math.floor(Math.random() * (gridSize - 2)) + 1;
            const y = Math.floor(Math.random() * (gridSize - 2)) + 1;

            const exists = treasures.some(t => t.x === x && t.y === y);
            if (!exists) {
                treasures.push({ x, y, type });
                added = true;
            }
        }
    };

    // 2. ГАРАНТИРОВАННЫЙ СПАВН (только для количества > 0)
    Object.entries(fixedTreasures).forEach(([type, requiredAmount]) => {
        for (let i = 0; i < requiredAmount; i++) {
            if (treasures.length < safeCount) {
                addTreasure(type);
            }
        }
    });

    // 3. РАНДОМНЫЙ СПАВН (используем отфильтрованный randomPoolTypes)
    while (treasures.length < safeCount && randomPoolTypes.length > 0) {
        const randomType = randomPoolTypes[Math.floor(Math.random() * randomPoolTypes.length)];
        addTreasure(randomType);
    }

    return treasures;
};

/**
 * Главная функция генерации лабиринта
 * @param {number} gridSize - размер сетки (5, 7, 9 и т.д.)
 * @param {number} level - текущий уровень (влияет на количество сокровищ)
 * @param id
 * @param fixedTreasures
 * @returns {Array<Array<Object>>} Двумерный массив плиток лабиринта
 */
export const generateMaze = (gridSize, level,id = "none",fixedTreasures = {}) => {

    // Количество сокровищ растет с уровнем


    const treasuresList = generateTreasuresList(level, gridSize,fixedTreasures);

    // Пропорции плиток на станции: ~40% углов, ~40% прямых, ~20% Т-образных перекрестков
    const TILE_WEIGHTS_BY_LEVEL = {
        // Стандартный уровень
        default: { corner: 40, straight: 40, t_shape: 20, locked: 2 ,auto_rotate:0},

        // Уровень 1-2 (появляются заблокированные плитки)
        '1-2':   { corner: 35, straight: 35, t_shape: 15, locked: 2,auto_rotate:0 },
        '1-3':   { corner: 35, straight: 35, t_shape: 15, locked: 4 ,auto_rotate:0},
        '2-2':   { corner: 30, straight: 30, t_shape: 20, locked: 0,auto_rotate:10 },
        '2-3':   { corner: 30, straight: 30, t_shape: 20, locked: 2,auto_rotate:10 },
        '3-1':   { corner: 30, straight: 30, t_shape: 20, locked: 0,auto_rotate:1,exit:6 },
        '3-2':   { corner: 30, straight: 30, t_shape: 20, locked: 5,auto_rotate:10 },
        '3-3':   { corner: 30, straight: 30, t_shape: 20, locked: 5,auto_rotate:10,sector:1 },
        '3-4':   { corner: 30, straight: 30, t_shape: 20, locked: 5,auto_rotate:10 },
        '4-1':   { corner: 30, straight: 30, t_shape: 20},
        '4-2':   { corner: 35, straight: 35, t_shape: 15},
        '4-3':   { corner: 35, straight: 35, t_shape: 15,sector:1},
        // Сложный сектор
        '5-2':   { corner: 30, straight: 30, t_shape: 20, locked: 20 ,auto_rotate:10},
    };

    const getWeightedRandomType = (levelId = 'default') => {
        const weights = TILE_WEIGHTS_BY_LEVEL[levelId] || TILE_WEIGHTS_BY_LEVEL.default;

        // Считаем общую сумму весов
        const totalWeight = Object.values(weights).reduce((acc, w) => acc + w, 0);
        let randomNum = Math.random() * totalWeight;

        for (const [type, weight] of Object.entries(weights)) {
            if (randomNum < weight) {
                return type;
            }
            randomNum -= weight;
        }

        return 'straight'; // Фоллбек
    };


    const newBoard = [];

    for (let y = 0; y < gridSize; y++) {
        const row = [];
        for (let x = 0; x < gridSize; x++) {
            // 1. Определяем тип плитки
            let type = getWeightedRandomType(id);

            // Гарантируем, что стартовые углы лабиринта (где могут стоять игроки)
            // будут Т-образными или углами, чтобы игроки не оказались заперты в прямой тупик
            if ((x === 0 && y === 0) || (x === gridSize-1 && y === gridSize-1)) {
                type = 't_shape';
            }



            // 2. Случайный начальный поворот (0, 90, 180, 270 градусов)
            const rotations = [0, 90, 180, 270];
            let rotation = rotations[Math.floor(Math.random() * rotations.length)];
            const SPECIAL_TILES = {
                "3-1": {
                    "1,1": { type: 'exit', rotation: 0 },
                    "3,1": { type: 'exit', rotation: 0 },
                    "5,2": { type: 'exit', rotation: 90 },
                    "3,3": { type: 'exit', rotation: 180 },
                    "1,3": { type: 'exit', rotation: 180 },
                    "0,4": { type: 'exit', rotation: 90 },
                },
                "3-3": {
                    // Ключ формируем динамически перед проверкой
                    [`${gridSize - 2},${gridSize - 2}`]: { type: 'sector_4', rotation: 0 }
                },
                "4-1": {
                    "0,4": { type: 'locked', rotation: 0 },
                    "1,4": { type: 'locked', rotation: 0 },
                    "2,4": { type: 'locked', rotation: 0 },
                    "3,4": { type: 'locked', rotation: 0 },
                    "4,4": { type: 'locked', rotation: 0 },
                    "4,3": { type: 'locked', rotation: 0 },
                    "4,2": { type: 'locked', rotation: 0 },
                    "4,1": { type: 'locked', rotation: 0 },
                    "4,0": { type: 'locked', rotation: 0 },
                    "3,3": { type: 'portal', rotation: 0 },
                    "6,7": { type: 'portal', rotation: 0 },
                    "6,3": { type: 'portal', rotation: 0 },
                    "5,4": { type: 'locked', rotation: 0 },
                    "6,4": { type: 'locked', rotation: 0 },
                    "7,4": { type: 'locked', rotation: 0 },
                },
                "4-2": {
                    "2,2": { type: 'portal', rotation: 0 },
                    "6,3": { type: 'portal', rotation: 0 },
                    "3,6": { type: 'portal', rotation: 0 },
                    "6,6": { type: 'portal', rotation: 0 },
                },
                "4-3": {
                    // --- РАМКИ 3-Х ОСТРОВОВ (из locked) ---
                    ...createLockedBox(-1, -1, 5, 5), // Забор Острова 1 (X: 0..3, Y: 0..3)
                    ...createLockedBox(3, -1, 5, 5), // Забор Острова 2 (X: 5..8, Y: 0..3)
                    ...createLockedBox(3, 3, 4, 4), // Забор Острова 3 (X: 3..6, Y: 5..8)

                    // --- КЛЮЧЕВЫЕ ПЛИТКИ И ПОРТАЛЫ ---
                    // Остров 1
                    "2,2": { type: 'portal', rotation: 0 },

                    // Остров 2
                    "6,1": { type: 'portal', rotation: 0 },
                    "7,1": { type: 'straight', rotation: 90, treasure: 'energy_core' },

                    // Остров 3
                    "4,6": { type: 'portal', rotation: 0 },
                    "4,5": { type: 'sector', rotation: 0 } // Высадка с Портала 2 попадает прямо на СЕКТОР-04!
                }
            };

// 💡 Применение в генераторе/цикле:
            const key = `${x},${y}`;
            const override = SPECIAL_TILES[id]?.[key];

            if (override) {
                type = override.type;
                rotation = override.rotation;
            }

            const playerId = -1
            let isFixed = false;
            // 3. Проверяем, должно ли на этой плитке лежать сокровище
            const treasureFound = treasuresList.find(t => t.x === x && t.y === y);
            const treasure = getTileTreasure(type,treasureFound,[] ,[])
            if(type === "exit"){
                isFixed = true;
            }

            // 4. Собираем объект плитки
            row.push({
                id: `tile-${x}-${y}`,
                x,
                y,
                type,
                rotation,
                treasure,
                playerId,
                isExplored: false, // Для механики тумана войны
                isFixed:isFixed
            });
        }
        newBoard.push(row);
    }

    return newBoard;
};

function getTileTreasure(tile,treasureFound){
    if (!treasureFound) return null;

    const tileType = typeof tile === 'object' ? tile?.type : tile;

    // 1. Заблокированные плитки — сразу null
    if (tileType === "locked") return null;

    // 2. На вращающихся плитках разрешаем ТОЛЬКО energy_core
    if (tileType === "auto_rotate") {
        return treasureFound.type === "energy_core" ? treasureFound.type : null;
    }

    // 3. На всех остальных плитках спавним любое найденное сокровище
    return treasureFound.type;

}

// Базовая проходимость при rotation = 0 [Вверх, Вправо, Вниз, Влево]
const TILE_EXITS = {
    straight:    [true, false, true, false],
    corner:      [false, true, true, false],
    t_shape:     [false, true, true, true],
    blocking:    [true, false, true, false],
    gateway:     [true, true, true, true],
    locked:      [false, false, false, false],
    auto_rotate: [false, false, false, true],
    exit:        [false, "OUT", false, "IN"],
    sector:        [false, false, true, false],
    portal:        [true, true, true, true],

    // 🚪 НОВЫЕ ОДНОСТОРОННИЕ ПЛИТКИ:
    // Односторонний клапан (при rot=0: Войти можно СЛЕВА, Выйти можно ВПРАВО)
    one_way:     [false, "OUT", false, "IN"],

    // Плитка-ловушка (при rot=0: Зайти можно с 3 сторон, а выйти только ВВЕРХ)
    one_way_exit: ["OUT", "IN", "IN", "IN"]
};

// Получить выходы с учетом текущего поворота плитки
const getRotatedExits = (type, rotation) => {
    const base = TILE_EXITS[type] || [false, false, false, false];
    const shifts = (rotation / 90) % 4;
    if (shifts === 0) return base;

    return [...base.slice(4 - shifts), ...base.slice(0, 4 - shifts)];
};

// Проверка возможности сделать шаг ИЗ tileA В tileB
// dir: 0 = Вверх, 1 = Вправо, 2 = Вниз, 3 = Влево
const canMoveBetween = (tileA, tileB, dir) => {
    const exitsA = getRotatedExits(tileA.type, tileA.rotation);
    const exitsB = getRotatedExits(tileB.type, tileB.rotation);

    const oppositeDir = (dir + 2) % 4;

    const exitA = exitsA[dir];
    const enterB = exitsB[oppositeDir];

    // Проверяем возможность ВЫХОДА из плитки А в направлении dir
    const canExitA = exitA === true || exitA === "OUT";

    // Проверяем возможность ВХОДА в плитку Б с направления oppositeDir
    const canEnterB = enterB === true || enterB === "IN";

    return canExitA && canEnterB;
};



export const findAvailablePaths = (startX, startY, stepsLeft, board) => {
    const gridSize = board.length;
    const queue = [[startX, startY, 0, []]]; // Добавляем массив для текущего пути
    const visited = new Set();
    const pathsMap = {}; // Сюда запишем: { "2-3": [[0,0], [1,0], [2,0], [2,1], [2,2], [2,3]] }

    const dX = [0, 1, 0, -1];
    const dY = [-1, 0, 1, 0];

    visited.add(`${startX}-${startY}`);

    while (queue.length > 0) {
        const [x, y, dist, currentPath] = queue.shift();
        const newPath = [...currentPath, [x, y]]; // Добавляем текущую точку в маршрут

        if (dist > 0) {
            pathsMap[`${x}-${y}`] = newPath; // Сохраняем полный путь до этой клетки
        }

        if (dist === stepsLeft) continue;

        const currentTile = board[y][x];

        for (let i = 0; i < 4; i++) {
            const nextX = x + dX[i];
            const nextY = y + dY[i];
            const key = `${nextX}-${nextY}`;

            if (nextX >= 0 && nextX < gridSize && nextY >= 0 && nextY < gridSize) {
                if (!visited.has(key)) {
                    const nextTile = board[nextY][nextX];

                    // Наша проверка стыковки шлюзов из прошлых шагов
                    if (canMoveBetween(currentTile, nextTile, i)) {
                        visited.add(key);
                        queue.push([nextX, nextY, dist + 1, newPath]);
                    }
                }
            }
        }
    }

    return pathsMap;
};

export const getCameraOffset = (playerX, playerY, viewBoxWidth = 340, viewBoxHeight = 340) => {
    // Вычисляем физический центр плитки игрока в координатах SVG
    const playerSvgX = playerX * 100 + 50;
    const playerSvgY = playerY * 100 + 50;

    // Находим точку смещения, чтобы игрок оказался ровно по центру viewBox
    const offsetX = viewBoxWidth / 2 - playerSvgX;
    const offsetY = viewBoxHeight / 2 - playerSvgY;

    return { offsetX, offsetY };
};

export const countTotalTreasures = (boardArray) => {
    if (!boardArray) return 0;

    let total = 0;

    // Проходим по всем строкам карты
    boardArray.forEach(row => {
        // В каждой строке проходим по каждой плитке
        row.forEach(tile => {

            // Если поле treasure не null и не undefined, значит, там что-то лежит
            if (tile.treasure !== null && tile.treasure !== undefined) {
                total++;
            }
        });
    });

    return total;
};

// Проверяет, соединены ли две плитки с учетом их координат
// dir: 0 = Вверх, 1 = Вправо, 2 = Вниз, 3 = Влево
export const checkConnection = (tileA, tileB) => {
    if (!tileA || !tileB) return false;

    // Определяем направление от A к B
    let dir = -1;
    if (tileB.y === tileA.y - 1 && tileB.x === tileA.x) dir = 0; // Вверх
    if (tileB.x === tileA.x + 1 && tileB.y === tileA.y) dir = 1; // Вправо
    if (tileB.y === tileA.y + 1 && tileB.x === tileA.x) dir = 2; // Вниз
    if (tileB.x === tileA.x - 1 && tileB.y === tileA.y) dir = 3; // Влево

    if (dir === -1) return false; // Плитки не соседние

    return canMoveBetween(tileA, tileB, dir);
};

export function splitArray(arr, parts) {
    const result = []
    const size = Math.ceil(arr.length / parts)

    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size))
    }

    return result
}


export const generateColor = () => {
    const colors = [];
    for (let h = 0; h < 360; h += 30) { // 12 шагов по оттенку
        colors.push(`hsl(${h}, 80%, 50%)`);
    }
    return colors;
};


export function treasurePlayerCount(board, idx){
    return board.map((el)=>el.filter((p)=> p.playerId === idx)).filter((f)=>f.length > 0).length
}

export function getMaxResult(arr) {
    if (!arr || arr.length === 0) return null; // защита от пустого массива
    return Math.max(...arr);
}

// Извлечение translate(x,y)
export function getTranslate(transform) {
    const match = transform.match(/translate\(([^)]+)\)/);
    if (!match) return null;
    const [x, y] = match[1].split(/[\s,]+/).map(Number);
    return { x, y: y ?? 0 };
}

// Извлечение rotate(angle[,cx,cy])
export function getRotate(transform) {
    const match = transform.match(/rotate\(([^)]+)\)/);
    if (!match) return null;
    const parts = match[1].split(/[\s,]+/).map(Number);
    const [angle, cx, cy] = parts;
    return { angle, cx: cx ?? 0, cy: cy ?? 0 };
}

// Извлечение scale(sx[,sy])
export function getScale(transform) {
    const match = transform.match(/scale\(([^)]+)\)/);
    if (!match) return null;
    const [sx, sy] = match[1].split(/[\s,]+/).map(Number);
    return { sx, sy: sy ?? sx };
}

export function getPlayersPoint(game, activePlayerIndex, player){
    return game.players.filter((f)=>f.x === player.x && f.y === player.y).length
}

export function getQuestTargetType(quests,game){

    return quests.filter((el)=>el.sectorId === game.selectLevel).map((lev)=>lev.levels.find((levF)=>levF.id===game.id))[0]?.fixedTreasures.type;
}

export function getCompletionCredits(quests,game){

    return quests.filter((el)=>el.sectorId === game.selectLevel).map((lev)=>lev.levels.find((levF)=>levF.id===game.id))[0]?.rewards.completionCredits;
}

export function getCreditPerTreasure(quests,game){

    return quests.filter((el)=>el.sectorId === game.selectLevel).map((lev)=>lev.levels.find((levF)=>levF.id===game.id))[0]?.rewards.creditPerTreasure;
}

export function getTurnSpeedBonus(quests,game){
    return quests.filter((el)=>el.sectorId === game.selectLevel).map((lev)=>lev.levels.find((levF)=>levF.id===game.id))[0].rewards.turnSpeedBonus;
}

export function getObjectivesTarget(quests,game){
    return quests.filter((el)=>el.sectorId === game.selectLevel).map((lev)=>lev.levels.find((levF)=>levF.id=== game.id))[0].objectives.main.target;
}

export const createLockedBox = (startX, startY, width, height) => {
    const config = {};
    for (let y = startY; y < startY + height; y++) {
        for (let x = startX; x < startX + width; x++) {
            // Если это край рамки — ставим locked
            if (x === startX || x === startX + width - 1 || y === startY || y === startY + height - 1) {
                config[`${x},${y}`] = { type: 'locked', rotation: 0 };
            }
        }
    }
    return config;
};