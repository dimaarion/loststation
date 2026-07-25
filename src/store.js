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
    selectLevel:1,
    page:"start_menu",
    gamePhase: "ROLL",
    droidType:[
        {name:"base",color:"#00F0FF",type:"base"},
        {name:"II-88",color:"#00F0FF",type:"II-88"},
        {name:"CRAB-M",color:"#FFE680",type:"CRAB-M"}
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
        id:"1-1",
        players:[
            { id: 1, name: 'Дроид АЛЬФА', x: 0, y: 0, color: '#00F0FF', stepsLeft: 0,treasure:0,type:"base",isAI: false },
            { id: 2, name: 'Механоид ИИ-88', x: 1, y: 0, color: '#FF9900', stepsLeft: 0,treasure:0, type:"II-88", isAI: true }
        ]
    },
    quests:[
        {
            sectorId: 1,
            sectorName: "Шлюзовый Отсек",
            description: "Начальный сектор станции. Ознакомление с механикой пере коммутации кабелей и базовой сборкой данных.",
            bgTheme: "docking_bay",
            unlocked: true,
            levels: [
                {
                    id: "1-1",
                    title: "Первый Контакт",
                    targetTreasures: 15,
                    maxTurns: 15,
                    scanRadius: 3,
                    botBehavior: "passive", // Базовый ИИ, видимость в пределах кубика
                    hazards: [],
                    winCondition: {
                        type: "COLLECT_MORE", // Собрать больше сокровищ, чем бот
                        amount: 8
                    },
                    starCriteria: {
                        oneStar: "Победа в матче",
                        twoStar: "Собрать не менее 10 сокровищ",
                        threeStar: "Победа менее чем за 8 ходов"
                    },
                    rewards: {
                        dataShards: 100,
                        unlockItem: "radar_booster_v1"
                    }
                },
                {
                    id: "1-2",
                    title: "Заблокированный Маршрут",
                    targetTreasures: 20,
                    maxTurns: 12,
                    scanRadius: 4,
                    botBehavior: "standard",
                    hazards: ["locked_tiles"], // Наличие заклинивших секций
                    winCondition: {
                        type: "COLLECT_ALL_OR_MOST",
                        amount: 11
                    },
                    starCriteria: {
                        oneStar: "Победа в матче",
                        twoStar: "Собрать не менее 15 сокровищ",
                        threeStar: "Не застрять ни разу за игру"
                    },
                    rewards: {
                        dataShards: 150,
                        unlockItem: null
                    }
                }
            ]
        },
        {
            sectorId: 2,
            sectorName: "Энергоблок",
            description: "Сектор с нестабильной подачей энергии. Остерегайтесь подсвеченных перегруженных секций.",
            bgTheme: "power_core",
            unlocked: false,
            levels: [
                {
                    id: "2-1",
                    title: "Высокое Напряжение",
                    targetTreasures: 25,
                    maxTurns: 14,
                    scanRadius: 4,
                    botBehavior: "cautious", // Бот обходит опасные плитки
                    hazards: ["overcharged_tiles"], // Переменное напряжение раз в 2 хода
                    winCondition: {
                        type: "COLLECT_MORE",
                        amount: 13
                    },
                    starCriteria: {
                        oneStar: "Победа в матче",
                        twoStar: "Не попадать под разряд тока",
                        threeStar: "Завершить за 10 ходов"
                    },
                    rewards: {
                        dataShards: 250,
                        unlockItem: "insulating_coating"
                    }
                }
            ]
        },
        {
            sectorId: 3,
            sectorName: "Био-Лаборатории",
            description: "Засекреченный отсек. Для доступа к редким артефактам требуются ключ-карты.",
            bgTheme: "bio_lab",
            unlocked: false,
            levels: [
                {
                    id: "3-1",
                    title: "Охота за Доступом",
                    targetTreasures: 30,
                    maxTurns: 16,
                    scanRadius: 5,
                    botBehavior: "aggressive_collector", // Бот первично бежит за ключ-картами
                    hazards: ["keycard_doors", "locked_tiles"],
                    winCondition: {
                        type: "COLLECT_KEYS_AND_TREASURE",
                        requiredKeys: 3,
                        amount: 16
                    },
                    starCriteria: {
                        oneStar: "Собрать все 3 ключ-карты и победить",
                        twoStar: "Собрать > 20 сокровищ",
                        threeStar: "Победа без пропуска ходов"
                    },
                    rewards: {
                        dataShards: 400,
                        unlockItem: "hack_tool_v1"
                    }
                }
            ]
        },
        {
            sectorId: 4,
            sectorName: "Серверный Сектор",
            description: "Серверная погружена в туман войны. Данные улетучиваются с каждым ходом.",
            bgTheme: "server_room",
            unlocked: false,
            levels: [
                {
                    id: "4-1",
                    title: "Утечка Данных",
                    targetTreasures: 35,
                    maxTurns: 12,
                    scanRadius: 3, // Ограниченный обзор
                    botBehavior: "cheater_omnipresent", // Бот видит сквозь туман
                    hazards: ["fog_of_war", "data_decay"], // Сокровища теряют ценность
                    winCondition: {
                        type: "RACE_AGAINST_TIME",
                        amount: 18
                    },
                    starCriteria: {
                        oneStar: "Победа в матче",
                        twoStar: "Набрать 25+ очков до деградации данных",
                        threeStar: "Завершить за 9 ходов"
                    },
                    rewards: {
                        dataShards: 600,
                        unlockItem: "thermal_imager"
                    }
                }
            ]
        },
        {
            sectorId: 5,
            sectorName: "Главное Ядро",
            description: "Финальный рубеж. Финальное противостояние с авто-системой защиты A.E.G.I.S.",
            bgTheme: "ai_core",
            unlocked: false,
            levels: [
                {
                    id: "5-1",
                    title: "Перекодирование A.E.G.I.S.",
                    targetTreasures: 50,
                    maxTurns: 20,
                    scanRadius: 6,
                    botBehavior: "boss_aegis", // Контролирует всю карту и вращает ряды
                    hazards: ["global_grid_shift", "roaming_mines"],
                    winCondition: {
                        type: "BOSS_DEFEAT", // Подключить 4 угловых терминала
                        requiredTerminals: 4
                    },
                    starCriteria: {
                        oneStar: "Перекодировать все 4 терминала",
                        twoStar: "Не получить урон от мин",
                        threeStar: "Победа менее чем за 14 ходов"
                    },
                    rewards: {
                        dataShards: 1500,
                        unlockItem: "skin_gold_alpha"
                    }
                }
            ]
        }
    ],
    pause:false,
    maze:generateMaze(5, 1),
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
    setGamePlayerType:(el)=>set((state) =>  ({ game: {...state.game, players: state.game.players.map((p)=>{
        if(p.id === 1){
            p.type = el;
        }
        return p
            })} })),
    setGamePlayerTreasure:(el, n)=>set((state) =>  ({ game: {...state.game, players: state.game.players.map((p,idx)=>{
                if(idx === el){
                    p.treasure = n;
                }
                return p
            })} })),

}))

export default useStore