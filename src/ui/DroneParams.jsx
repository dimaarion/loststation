import {SpaceDroidToken} from "../components/Players.jsx";
import useStore from "../store.js";
import {DroidInput, SvgColorPicker} from "../components/Objects.jsx";
import {useState} from "react";
import {generateColor} from "../action.js";
import Btn from "./Btn.jsx";

export default function DroneParams({height, width, ratio}){
    const type = useStore((state)=>state.type)
    const droid = useStore((state)=>state.droidType)
    const colors = useStore((state)=>state.colors)
    const [name, setName] = useState(droid.find((el)=>el.type === type).name)
    const colorDroid = droid.find((el)=>el.type === type).color

    return <g>
        <defs>
            <linearGradient id="bg_game_one" gradientUnits="userSpaceOnUse" x1="30%" y1="0" x2="90%" y2="100%">
                <stop offset="0" stopColor="#172633" />
                <stop offset="1" stopColor="#96A8B0" />
            </linearGradient>
            <linearGradient id="gradient_game_one_box" gradientUnits="userSpaceOnUse" x1="-0.211" y1="130" x2="417.789" y2="130">
                <stop offset="0" stopColor="#73CDD1" />
                <stop offset="50%" stopColor="#207478" />
                <stop offset="1" stopColor="#73CDD1" />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="#0C1921" fillRule="evenodd" />
        <g>
            <rect width="500" height="500" fill="url(#bg_game_one)" fillRule="evenodd" strokeWidth={10} stroke={"#1C2833"} transform={'rotate(45 250 250)'} />
        </g>

        <g transform={`translate(${width / ratio / 2 - (width > 603?-30:95)} ${width > 603?50:300}) scale(1)`}>
            <DroidInput value={name} onChange={(e)=> {
                if(e.target.value.length < 15) {
                    setName(e.target.value)
                    useStore.getState().setDroidType(
                        droid.map((el)=>{
                            if(type === el.type){
                                el.name = e.target.value
                            }
                            return el
                        })
                    )
                }


            }}/>
        </g>

        <svg x={width > 608?`0`:`50%`} width={400} height={400} viewBox={`0 0 100 100`} transform={`translate(${width > 608?-80:-200} ${0})`}>
            {droid.filter((el)=>el.type === type).map((el,i)=><SpaceDroidToken key = {i + "droid"} type={el.type} name={el.name} color={el.color}/>)}
        </svg>
        <g transform={`scale(1) translate(${(width / ratio) / 2 - (width > 603?0:110)} ${width > 603?80:350})`}>
            <SvgColorPicker color={colorDroid} colors={colors}  onChange={(e)=>{
                useStore.getState().setDroidType(
                    droid.map((el)=>{
                        if(type === el.type){
                            el.color = e
                        }
                        return el
                    })
                )
            }}/>
        </g>
            <g onPointerDown={()=>{
                useStore.getState().setPage("game_one")
            }} transform={`translate(${(width / ratio) / 2 - (width > 606?-30:80)} ${width > 606?250:520})`}>
                <Btn x={0} y={0} scale={0.2} text={"Сохранить"} fontSize={80} tx={40} ty={160} />
            </g>
        <g onPointerDown={()=>{
            useStore.getState().setPage("game_one")
        }} transform={`translate(${(width / ratio) / 2 - (width > 606?-120:-10)} ${width > 606?250:520})`}>
            <Btn x={0} y={0} scale={0.2} text={"Закрыть"} fontSize={80} tx={60} ty={160} />
        </g>
    </g>
}