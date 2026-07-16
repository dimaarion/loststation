export const TILE_TYPES = ['straight', 'corner', 't_shape'];

/**
 * Генерирует массив сокровищ для уровня
 * @param {number} count - сколько сокровищ нужно создать
 * @param {number} gridSize - размер сетки
 * @returns {Array<{x: number, y: number, type: string}>}
 */
const generateTreasuresList = (count, gridSize) => {
    const treasures = [];
    const types = ['energy_core', 'Gravity Booster', 'alien_artifact', 'Quantum Wrench', 'Void Radar', 'Plasma Cutter'];

    // ГАРАНТИЯ: Если count меньше 1, принудительно устанавливаем минимум 1 сокровище
    const finalCount = Math.max(1, count);

    // Дополнительная проверка на случай слишком маленькой сетки (чтобы цикл не стал бесконечным)
    const maxAvailableCells = (gridSize - 2) * (gridSize - 2);
    const safeCount = Math.min(finalCount, maxAvailableCells);

    while (treasures.length < safeCount) {
        // Генерируем случайные координаты (исключая углы 0,0 и крайние точки, где обычно стартуют игроки)
        const x = Math.floor(Math.random() * (gridSize - 2)) + 1;
        const y = Math.floor(Math.random() * (gridSize - 2)) + 1;

        // Проверяем, нет ли уже сокровища на этих координатах
        const exists = treasures.some(t => t.x === x && t.y === y);

        if (!exists) {
            const randomType = types[Math.floor(Math.random() * types.length)];
            treasures.push({ x, y, type: randomType });
        }
    }
    return treasures;
};

/**
 * Главная функция генерации лабиринта
 * @param {number} gridSize - размер сетки (5, 7, 9 и т.д.)
 * @param {number} level - текущий уровень (влияет на количество сокровищ)
 * @returns {Array<Array<Object>>} Двумерный массив плиток лабиринта
 */
export const generateMaze = (gridSize, level) => {
    // Количество сокровищ растет с уровнем

    const treasuresCount = level * 2 + 1;
    const treasuresList = generateTreasuresList(treasuresCount, gridSize);

    // Пропорции плиток на станции: ~40% углов, ~40% прямых, ~20% Т-образных перекрестков
    const getWeightedRandomType = () => {
        const rand = Math.random();
        if (rand < 0.4) return 'corner';
        if (rand < 0.8) return 'straight';
        return 't_shape';
    };

    const newBoard = [];

    for (let y = 0; y < gridSize; y++) {
        const row = [];
        for (let x = 0; x < gridSize; x++) {
            // 1. Определяем тип плитки
            let type = getWeightedRandomType();

            // Гарантируем, что стартовые углы лабиринта (где могут стоять игроки)
            // будут Т-образными или углами, чтобы игроки не оказались заперты в прямой тупик
            if ((x === 0 && y === 0) || (x === gridSize-1 && y === gridSize-1)) {
                type = 't_shape';
            }

            // 2. Случайный начальный поворот (0, 90, 180, 270 градусов)
            const rotations = [0, 90, 180, 270];
            const rotation = rotations[Math.floor(Math.random() * rotations.length)];

            // 3. Проверяем, должно ли на этой плитке лежать сокровище
            const treasureFound = treasuresList.find(t => t.x === x && t.y === y);
            const treasure = treasureFound ? treasureFound.type : null;

            // 4. Собираем объект плитки
            row.push({
                id: `tile-${x}-${y}`,
                x,
                y,
                type,
                rotation,
                treasure,
                isExplored: false // Для механики тумана войны
            });
        }
        newBoard.push(row);
    }

    return newBoard;
};

// Базовая проходимость при rotation = 0 [Вверх, Вправо, Вниз, Влево]
const TILE_EXITS = {
    straight: [true, false, true, false],  // Прямая (проход Вверх-Вниз)
    corner:   [false, true, true, false],  // Угол (проход Вниз-Вправо)
    t_shape:  [false, true, true, true]    // Т-образная (Вверх-Вправо-Влево)
};

// Получить выходы с учетом текущего поворота плитки
const getRotatedExits = (type, rotation) => {
    const base = TILE_EXITS[type];
    const shifts = (rotation / 90) % 4; // 0, 1, 2 или 3 сдвига
    if (shifts === 0) return base;

    // Циклический сдвиг массива вправо
    return [...base.slice(4 - shifts), ...base.slice(0, 4 - shifts)];
};

// Проверка стыковки двух соседних плиток
const canMoveBetween = (tileA, tileB, dir) => {
    const exitsA = getRotatedExits(tileA.type, tileA.rotation);
    const exitsB = getRotatedExits(tileB.type, tileB.rotation);

    // dir: 0 = Вверх, 1 = Вправо, 2 = Вниз, 3 = Влево (относительно плитки А)
    // Противоположное направление для плитки Б:
    const oppositeDir = (dir + 2) % 4;

    return exitsA[dir] && exitsB[oppositeDir];
};

/*export const findAvailableMoves = (startX, startY, stepsLeft, board) => {
    const gridSize = board.length;
    const visited = new Set(); // Посещенные плитки
    const queue = [[startX, startY, 0]]; // Очередь: [x, y, currentDist]
    const availableTiles = []; // Итог: доступные для хода плитки

    // Смещение по индексам: 0: Вверх, 1: Вправо, 2: Вниз, 3: Влево
    const dX = [0, 1, 0, -1];
    const dY = [-1, 0, 1, 0];

    visited.add(`${startX}-${startY}`);

    while (queue.length > 0) {
        const [x, y, dist] = queue.shift();

        // Если это не стартовая точка, добавляем её в доступные для хода
        if (dist > 0) {
            availableTiles.push(`${x}-${y}`);
        }

        // Если лимит шагов кубика исчерпан, дальше не идем
        if (dist === stepsLeft) continue;

        const currentTile = board[y][x];

        // Проверяем все 4 направления вокруг текущей плитки
        for (let i = 0; i < 4; i++) {
            const nextX = x + dX[i];
            const nextY = y + dY[i];
            const key = `${nextX}-${nextY}`;

            // Проверка границ сетки
            if (nextX >= 0 && nextX < gridSize && nextY >= 0 && nextY < gridSize) {
                if (!visited.has(key)) {
                    const nextTile = board[nextY][nextX];

                    // КРИТИЧЕСКАЯ ПРОВЕРКА: открыты ли шлюзы между ними?
                    if (canMoveBetween(currentTile, nextTile, i)) {
                        visited.add(key);
                        queue.push([nextX, nextY, dist + 1]);
                    }
                }
            }
        }
    }

    return availableTiles; // Массив строк вида ["1-0", "1-1", "2-1"]
};*/

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



