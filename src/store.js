import { create } from 'zustand'
import {generateColor, generateMaze, getRandomInt} from "./action.js";

const useStore = create((set) => ({
    stars:new Array(window.innerWidth).fill(true).map(()=>{
      return  {
            position:{
                x: getRandomInt(0, window.innerWidth), y: getRandomInt(0, window.innerHeight)
            },
           width:getRandomInt(0, 50),
           height:getRandomInt(0, 50),
           scale:getRandomInt(0, 100),
        };

    }),
    credits:0,
    pointsGame:[],
    selectLevel:1,
    numberMoves:0,
    questTarget:0,
    message:"",
    levelId:"1-1",
    page:"start_menu",
    gamePhase: "ROLL",
    droidType:[
        {name:"base",color:"#00F0FF",type:"base",credits:0},
        {name:"II-88",color:"#00F0FF",type:"II-88",credits:0},
        {name:"CRAB-M",color:"#FFE680",type:"CRAB-M",credits:0},
        {name:"VCTR-7",color:"#00FF66",type:"VCTR-7",credits:0},
        {name:"ANBS-3",color:"#D080FF",type:"ANBS-3",credits:0},
        {name:"AEGIS-9",color:"#FF3344",type:"AEGIS-9",credits:0},
        {name:"SPTR-5",color:"#3344FF",type:"SPTR-5",credits:0},
        {name:"MGMA-4",color:"#FFDD00",type:"MGMA-4",credits:0},
        {name:"COLT-8",color:"#9900FF",type:"COLT-8",credits:0},
        {name:"WARP-6",color:"#00E6A4",type:"WARP-6",credits:0},
        {name:"FIX-0",color:"#FFBF00",type:"FIX-0",credits:0},
        {name:"MULE-1",color:"#D2691E",type:"MULE-1",credits:0},
        {name:"NEXUS-3",color:"#FFFFFF",type:"NEXUS-3",credits:0},
        {name:"SIREN-1",color:"#FF66CC",type:"SIREN-1",credits:0},
    ],
    colors:generateColor(),
    type:"base",
    size:{width: window.innerWidth, height: window.innerHeight},
    ratio:(window.innerWidth + window.innerHeight) / 1000,
    game:{
        base:5,
        level:1,
        selectLevel:1,
        type:"",
        page:"start_menu",
        id:"1-1",
        players:[
            { id: 1, name: 'Дроид АЛЬФА', x: 0, y: 0, credits:0, color: '#00F0FF', stepsLeft: 0,treasure:0,type:"base",isAI: false },
            { id: 2, name: 'Механоид ИИ-88', x: 1, y: 0,credits:0, color: '#FF9900', stepsLeft: 0,treasure:0, type:"II-88", isAI: true }
        ]
    },
    quests:[
        // ==========================================
        // СЕКТОР 1: Шлюзовый Отсек
        // ==========================================
        {
            sectorId: 1,
            sectorName: "Шлюзовый Отсек",
            storyTitle: "Аварийный Вход",
            defaultGridSize: 5,
            introDialogue: { speaker: "ИИ-88", text: "Обнаружен неопознанный объект. Запуск очистки..." },
            levels: [
                {
                    id: "1-1",
                    title: "Разведка Дока",
                    gridSize: 6,
                    maxTurns: 20,
                    lockTurn: 12,
                    scanRadius: 3,
                    botBehavior: "passive",
                    hazards: [],
                    fixedTreasures: { 'leg-data': 10,type:'leg-data'},
                    objectives: { main: { text: "Собрать 5 логов данных", type: "COLLECT_AMOUNT", target: 5 } },
                    rewards: { completionCredits: 200, creditPerTreasure: 10, turnSpeedBonus: 15 }
                },
                {
                    id: "1-2",
                    title: "Заклинивший Коридор",
                    gridSize: 5,
                    maxTurns: 14,
                    lockTurn: 10,
                    scanRadius: 3,
                    botBehavior: "standard",
                    hazards: ["locked_tile"],
                    fixedTreasures: { 'leg-data': 8 },
                    objectives: { main: { text: "Обойти заблокированные шлюзы", type: "COLLECT_AMOUNT", target: 8 } },
                    rewards: { completionCredits: 300, creditPerTreasure: 15, turnSpeedBonus: 20 }
                },
                {
                    id: "1-3",
                    title: "Сбор Аварийных Логов",
                    gridSize: 6,
                    maxTurns: 15,
                    lockTurn: 12,
                    scanRadius: 4,
                    botBehavior: "standard",
                    hazards: ["locked_tile"],
                    fixedTreasures: { 'leg-data': 10 },
                    objectives: { main: { text: "Собрать 10 логов до блокировки", type: "COLLECT_AMOUNT", target: 10 } },
                    rewards: { completionCredits: 450, creditPerTreasure: 20, turnSpeedBonus: 25 }
                }
            ]
        },

        // ==========================================
        // СЕКТОР 2: Генераторная
        // ==========================================
        {
            sectorId: 2,
            sectorName: "Генераторная",
            storyTitle: "Магнитные Роторы",
            defaultGridSize: 6,
            introDialogue: { speaker: "Бортовой Компьютер", text: "Магнитные турбины вращают секции каждые 2 хода." },
            levels: [
                { id: "2-1", title: "Шестеренки Станции", gridSize: 6, maxTurns: 14, lockTurn: 10, scanRadius: 4, botBehavior: "standard", hazards: ["auto_rotate"], fixedTreasures: { 'energy_core': 2, 'leg-data': 4 }, objectives: { main: { text: "Собрать 2 Энерго-Ядра", type: "COLLECT_SPECIFIC", target: 2 } }, rewards: { completionCredits: 500, creditPerTreasure: 20, turnSpeedBonus: 30 } },
                { id: "2-2", title: "Нестабильный Поток", gridSize: 6, maxTurns: 15, lockTurn: 9, scanRadius: 4, botBehavior: "smart_pathfinder", hazards: ["auto_rotate", "locked_tile"], fixedTreasures: { 'energy_core': 3, 'leg-data': 6 }, objectives: { main: { text: "Собрать 6 данных в динамическом поле", type: "COLLECT_AMOUNT", target: 6 } }, rewards: { completionCredits: 650, creditPerTreasure: 25, turnSpeedBonus: 35 } },
                { id: "2-3", title: "Перепитать Генераторы", gridSize: 7, maxTurns: 16, lockTurn: 8, scanRadius: 5, botBehavior: "smart_pathfinder", hazards: ["auto_rotate", "locked_tile"], fixedTreasures: { 'energy_core': 4 }, objectives: { main: { text: "Подключить 2 терминала", type: "CONNECT_TERMINALS", target: 2 } }, rewards: { completionCredits: 800, creditPerTreasure: 30, turnSpeedBonus: 40 } }
            ]
        },

        // ==========================================
        // СЕКТОР 3: Навигационный Узел
        // ==========================================
        {
            sectorId: 3,
            sectorName: "Навигационный Узел",
            storyTitle: "Без Права на Ошибку",
            defaultGridSize: 6,
            introDialogue: { speaker: "ИИ-88", text: "Шлюзы односторонние. Назад дороги нет." },
            levels: [
                { id: "3-1", title: "Односторонний Переход", gridSize: 6, maxTurns: 14, lockTurn: 10, scanRadius: 4, botBehavior: "standard", hazards: ["one_way_tile"], fixedTreasures: { 'leg-data': 6 }, objectives: { main: { text: "Пройти через односторонние клапаны", type: "COLLECT_AMOUNT", target: 6 } }, rewards: { completionCredits: 600, creditPerTreasure: 25, turnSpeedBonus: 30 } },
                { id: "3-2", title: "Лабиринт Клапанов", gridSize: 6, maxTurns: 16, lockTurn: 11, scanRadius: 4, botBehavior: "smart_pathfinder", hazards: ["one_way_tile", "locked_tile"], fixedTreasures: { 'leg-data': 8 }, objectives: { main: { text: "Собрать 8 логов, не попав в тупик", type: "COLLECT_AMOUNT", target: 8 } }, rewards: { completionCredits: 750, creditPerTreasure: 30, turnSpeedBonus: 35 } },
                { id: "3-3", title: "Маршрут Навигатора", gridSize: 7, maxTurns: 18, lockTurn: 12, scanRadius: 4, botBehavior: "smart_pathfinder", hazards: ["one_way_tile", "auto_rotate"], fixedTreasures: { 'leg-data': 12 }, objectives: { main: { text: "Завершить проход к 4 сектору", type: "COLLECT_AMOUNT", target: 12 } }, rewards: { completionCredits: 900, creditPerTreasure: 35, turnSpeedBonus: 40 } }
            ]
        },

        // ==========================================
        // СЕКТОР 4: Гидропоника
        // ==========================================
        {
            sectorId: 4,
            sectorName: "Гидропоника",
            storyTitle: "Изолированные Сегменты",
            defaultGridSize: 7,
            introDialogue: { speaker: "Бортовой Компьютер", text: "Сектора разделены. Используйте квантовые узлы перемещения." },
            levels: [
                { id: "4-1", title: "Квантовые Мосты", gridSize: 7, maxTurns: 16, lockTurn: 12, scanRadius: 5, botBehavior: "smart_pathfinder", hazards: ["portal_nodes"], fixedTreasures: { 'leg-data': 8 }, objectives: { main: { text: "Использовать порталы для сбора логов", type: "COLLECT_AMOUNT", target: 8 } }, rewards: { completionCredits: 850, creditPerTreasure: 30, turnSpeedBonus: 35 } },
                { id: "4-2", title: "Перекрестный Сканер", gridSize: 7, maxTurns: 17, lockTurn: 11, scanRadius: 5, botBehavior: "cheater_omnipresent", hazards: ["portal_nodes", "one_way_tile"], fixedTreasures: { 'leg-data': 10 }, objectives: { main: { text: "Опередить бота на 3 изолированных островах", type: "COLLECT_AMOUNT", target: 10 } }, rewards: { completionCredits: 1000, creditPerTreasure: 35, turnSpeedBonus: 40 } },
                { id: "4-3", title: "Зачистка Купола", gridSize: 7, maxTurns: 18, lockTurn: 10, scanRadius: 5, botBehavior: "cheater_omnipresent", hazards: ["portal_nodes", "auto_rotate"], fixedTreasures: { 'leg-data': 12 }, objectives: { main: { text: "Собрать 12 логов на всех островах", type: "COLLECT_AMOUNT", target: 12 } }, rewards: { completionCredits: 1200, creditPerTreasure: 40, turnSpeedBonus: 45 } }
            ]
        },

        // ==========================================
        // СЕКТОР 5: Серверная Памяти
        // ==========================================
        {
            sectorId: 5,
            sectorName: "Серверная Памяти",
            storyTitle: "Быстрая Очистка",
            defaultGridSize: 7,
            introDialogue: { speaker: "Система", text: "Критический перегрев! Данные стираются с каждым ходом." },
            levels: [
                { id: "5-1", title: "Утечка Данных", gridSize: 7, maxTurns: 12, lockTurn: 8, scanRadius: 3, botBehavior: "cheater_omnipresent", hazards: ["fog_of_war", "data_decay"], fixedTreasures: { 'leg-data': 10 }, objectives: { main: { text: "Собрать 10 логов до их полной уценки", type: "COLLECT_AMOUNT", target: 10 } }, rewards: { completionCredits: 1100, creditPerTreasure: 40, turnSpeedBonus: 50 } },
                { id: "5-2", title: "Глубокий Файл", gridSize: 7, maxTurns: 14, lockTurn: 9, scanRadius: 3, botBehavior: "cheater_omnipresent", hazards: ["fog_of_war", "data_decay", "locked_tile"], fixedTreasures: { 'leg-data': 12 }, objectives: { main: { text: "Найти 12 логов в тумане войны", type: "COLLECT_AMOUNT", target: 12 } }, rewards: { completionCredits: 1300, creditPerTreasure: 45, turnSpeedBonus: 55 } },
                { id: "5-3", title: "Полная Резервация", gridSize: 8, maxTurns: 15, lockTurn: 10, scanRadius: 4, botBehavior: "cheater_omnipresent", hazards: ["fog_of_war", "data_decay", "auto_rotate"], fixedTreasures: { 'leg-data': 15 }, objectives: { main: { text: "Собрать 15 логов", type: "COLLECT_AMOUNT", target: 15 } }, rewards: { completionCredits: 1500, creditPerTreasure: 50, turnSpeedBonus: 60 } }
            ]
        },

        // ==========================================
        // СЕКТОР 6: Сверхпроводники
        // ==========================================
        {
            sectorId: 6,
            sectorName: "Сверхпроводники",
            storyTitle: "Запутанные Связи",
            defaultGridSize: 7,
            introDialogue: { speaker: "ИИ-88", text: "Каждое ваше движение разворачивает сеть на другой стороне." },
            levels: [
                { id: "6-1", title: "Зеркальные Плитки", gridSize: 7, maxTurns: 15, lockTurn: 10, scanRadius: 4, botBehavior: "smart_pathfinder", hazards: ["entangled_tiles"], fixedTreasures: { 'leg-data': 10 }, objectives: { main: { text: "Применить синхронное вращение", type: "COLLECT_AMOUNT", target: 10 } }, rewards: { completionCredits: 1300, creditPerTreasure: 45, turnSpeedBonus: 50 } },
                { id: "6-2", title: "Двойной Импульс", gridSize: 7, maxTurns: 16, lockTurn: 11, scanRadius: 4, botBehavior: "smart_pathfinder", hazards: ["entangled_tiles", "one_way_tile"], fixedTreasures: { 'leg-data': 12 }, objectives: { main: { text: "Проложить пути с учетом заклиниваний", type: "COLLECT_AMOUNT", target: 12 } }, rewards: { completionCredits: 1500, creditPerTreasure: 50, turnSpeedBonus: 55 } },
                { id: "6-3", title: "Синхронизатор", gridSize: 8, maxTurns: 17, lockTurn: 9, scanRadius: 5, botBehavior: "smart_pathfinder", hazards: ["entangled_tiles", "auto_rotate"], fixedTreasures: { 'leg-data': 14 }, objectives: { main: { text: "Подключить квантовые узлы", type: "COLLECT_AMOUNT", target: 14 } }, rewards: { completionCredits: 1700, creditPerTreasure: 55, turnSpeedBonus: 60 } }
            ]
        },

        // ==========================================
        // СЕКТОР 7: Охладительный Контур
        // ==========================================
        {
            sectorId: 7,
            sectorName: "Охладительный Контур",
            storyTitle: "Заморозка Систем",
            defaultGridSize: 8,
            introDialogue: { speaker: "Бортовой Компьютер", text: "Аварийная заморозка. Плитки замерзают после прохода." },
            levels: [
                { id: "7-1", title: "Хрупкий Лёд", gridSize: 8, maxTurns: 16, lockTurn: 10, scanRadius: 4, botBehavior: "smart_pathfinder", hazards: ["ice_tiles"], fixedTreasures: { 'leg-data': 10 }, objectives: { main: { text: "Не застрять на замерзающих плитках", type: "COLLECT_AMOUNT", target: 10 } }, rewards: { completionCredits: 1600, creditPerTreasure: 50, turnSpeedBonus: 55 } },
                { id: "7-2", title: "Термо-Шок", gridSize: 8, maxTurns: 17, lockTurn: 11, scanRadius: 4, botBehavior: "smart_pathfinder", hazards: ["ice_tiles", "locked_tile"], fixedTreasures: { 'leg-data': 12 }, objectives: { main: { text: "Собрать 12 логов", type: "COLLECT_AMOUNT", target: 12 } }, rewards: { completionCredits: 1800, creditPerTreasure: 55, turnSpeedBonus: 60 } },
                { id: "7-3", title: "Абсолютный Ноль", gridSize: 8, maxTurns: 18, lockTurn: 9, scanRadius: 5, botBehavior: "smart_pathfinder", hazards: ["ice_tiles", "auto_rotate"], fixedTreasures: { 'leg-data': 15 }, objectives: { main: { text: "Завершить путь к Ядру", type: "COLLECT_AMOUNT", target: 15 } }, rewards: { completionCredits: 2000, creditPerTreasure: 60, turnSpeedBonus: 65 } },
                { id: "7-4", title: "Подход к Серверу", gridSize: 8, maxTurns: 18, lockTurn: 8, scanRadius: 5, botBehavior: "cheater_omnipresent", hazards: ["ice_tiles", "entangled_tiles"], fixedTreasures: { 'leg-data': 16 }, objectives: { main: { text: "Разблокировать шлюз 8 сектора", type: "COLLECT_AMOUNT", target: 16 } }, rewards: { completionCredits: 2200, creditPerTreasure: 65, turnSpeedBonus: 70 } }
            ]
        },

        // ==========================================
        // СЕКТОР 8: Главное Ядро A.E.G.I.S.
        // ==========================================
        {
            sectorId: 8,
            sectorName: "Главное Ядро A.E.G.I.S.",
            storyTitle: "Перезагрузка Системы",
            defaultGridSize: 8,
            introDialogue: { speaker: "ИИ-88", text: "Я — эта станция. Каждая плитка, каждый кабель повинуется мне!" },
            levels: [
                { id: "8-1", title: "Внешний Брандмауэр", gridSize: 8, maxTurns: 18, lockTurn: 12, scanRadius: 5, botBehavior: "boss_aegis", hazards: ["locked_tile", "auto_rotate"], fixedTreasures: { 'leg-data': 12 }, objectives: { main: { text: "Взломать 1-ю линию защиты", type: "COLLECT_AMOUNT", target: 12 } }, rewards: { completionCredits: 2500, creditPerTreasure: 70, turnSpeedBonus: 80 } },
                { id: "8-2", title: "Ядро Защиты", gridSize: 8, maxTurns: 19, lockTurn: 11, scanRadius: 5, botBehavior: "boss_aegis", hazards: ["one_way_tile", "entangled_tiles"], fixedTreasures: { 'leg-data': 14 }, objectives: { main: { text: "Перегрузить защитный барьер", type: "COLLECT_AMOUNT", target: 14 } }, rewards: { completionCredits: 2800, creditPerTreasure: 75, turnSpeedBonus: 85 } },
                { id: "8-3", title: "Алгоритм ИИ-88", gridSize: 9, maxTurns: 20, lockTurn: 10, scanRadius: 5, botBehavior: "boss_aegis", hazards: ["ice_tiles", "auto_rotate"], fixedTreasures: { 'leg-data': 15 }, objectives: { main: { text: "Отключить подсистемы ИИ-88", type: "COLLECT_AMOUNT", target: 15 } }, rewards: { completionCredits: 3200, creditPerTreasure: 80, turnSpeedBonus: 90 } },
                { id: "8-4", title: "Финал: Перекодирование", gridSize: 9, maxTurns: 20, lockTurn: 10, scanRadius: 6, botBehavior: "boss_aegis", hazards: ["locked_tile", "auto_rotate", "ice_tiles"], fixedTreasures: { 'leg-data': 20 }, objectives: { main: { text: "Активировать 4 угловых терминала антивируса", type: "ACTIVATE_ALL_CORNER_TERMINALS", target: 4 } }, rewards: { completionCredits: 5000, creditPerTreasure: 100, turnSpeedBonus: 100 } }
            ]
        }
    ],
    pause:false,
    maze:generateMaze(5, 1),
    setCredits: (el) => set((state) => ({ credits:state.credits+=el})),
    setPause: (el) => set(() => ({ pause: el})),
    setMaze: (el) => set(() => ({ maze: el})),
    setGame: (el) => set(() => ({ game: el})),
    setRatio: (el) => set(() => ({ ratio: el})),
    setSize: (el) => set(() => ({ size: el})),
    setGamePhase: (el) => set(() => ({ gamePhase: el})),
    setPage: (el) => set(() => ({ page: el})),
    setStars: (el) => set(() => ({ stars: el})),
    setDroidType: (el) => set(() => ({ droidType: el})),
    setType: (el) => set(() => ({ type: el})),
    setGameType:(el)=>set((state) => ({ game: {...state.game, type: el} })),
    setGameSelectLevel:(el)=>set((state) => ({ game: {...state.game, selectLevel: el} })),
    setGameId:(el)=>set((state) => ({ game: {...state.game, id: el} })),
    setGamePlayerType:(el)=>set((state) =>  ({ game: {...state.game, players: state.game.players.map((p)=>{
        if(p.id === 1){
            p.type = el;
        }
        return p
            })} })),
    setGamePlayerName:(el)=>set((state) =>  ({ game: {...state.game, players: state.game.players.map((p)=>{
                if(p.id === 1){
                    p.name = el;
                }
                return p
            })} })),
    setGamePlayerTreasure:(el, n)=>set((state) =>  ({ game: {...state.game, players: state.game.players.map((p,idx)=>{
                if(idx === el){
                    p.treasure = n;
                }
                return p
            })} })),
    setPointsGame: (el) => set((state) => ({ pointsGame:[...state.pointsGame,el]})),
    removePointsGame: () => set(() => ({pointsGame:[]})),
    setGamePlayerColor:(el)=>set((state) =>  ({ game: {...state.game, players: state.game.players.map((p)=>{
                if(p.id === 1){
                    p.color = el;
                }
                return p
            })} })),
    setGamePlayerPositionRestart:()=>set((state) =>  ({ game: {...state.game, players: state.game.players.map((p,idx)=>{
                    p.x = 0;
                    p.y = 0
                return p
            })} })),
    setNumberMoves:()=>set((state) => ({ numberMoves: state.numberMoves += 1 })),
    setNumberMovesRestart:()=>set(() => ({ numberMoves: 0 })),
    setMessage: (el) => set(() => ({message:el})),
    setQuestTarget: () => set((state) => ({questTarget:state.questTarget +=1 })),
    restartQuestTarget: () => set(() => ({questTarget:0 })),

}))

export default useStore