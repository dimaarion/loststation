import { create } from 'zustand'
import {getRandomInt, routable} from "./action.js";

const useStore = create((set) => ({
    stars:new Array(1000).fill(true).map(()=>{
      return  {
            position:{
                x: getRandomInt(0, window.innerWidth), y: getRandomInt(0, window.innerHeight)
            },
           width:getRandomInt(0, 50),
           height:getRandomInt(0, 50),
           scale:getRandomInt(0, 100),
        };

    }),
    gamePhase: "ROLL",
    setGamePhase: (el) => set(() => ({ gamePhase: el})),

}))

export default useStore