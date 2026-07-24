import { create } from 'zustand'
import {generateColor, getRandomInt} from "./action.js";

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
    page:"start_menu",
    gamePhase: "ROLL",
    droidType:[
        {name:"base",color:"#00F0FF",type:"base"},
        {name:"II-88",color:"#00F0FF",type:"II-88"},
        {name:"CRAB-M",color:"#FFE680",type:"CRAB-M"}
    ],
    colors:generateColor(),
    type:"base",
    gameOneFight:{
        bot:1,
        station:10,
        level:1
    },
    size:{width: window.innerWidth, height: window.innerHeight},
    ratio:(window.innerWidth + window.innerHeight) / 1000,
    game:{
        base:5,
        level:1,
        players:[]
    },
    setGame: (el) => set(() => ({ game: el})),
    setRatio: (el) => set(() => ({ ratio: el})),
    setSize: (el) => set(() => ({ size: el})),
    setGamePhase: (el) => set(() => ({ gamePhase: el})),
    setPage: (el) => set(() => ({ page: el})),
    setStars: (el) => set(() => ({ stars: el})),
    setDroidType: (el) => set(() => ({ droidType: el})),
    setType: (el) => set(() => ({ type: el})),
    setGameOneFight: (el) => set(() => ({ gameOneFight: el})),
}))

export default useStore