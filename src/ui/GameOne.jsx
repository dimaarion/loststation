import Btn from "./Btn.jsx";
import {useState} from "react";
import {SpaceDroidToken} from "../components/Players.jsx";
import useStore from "../store.js";


export default function GameOne({width, height, ratio}){
    const [step, setStep] = useState(0)
    const [fight, setFight] = useState(false)
    const [passing, setPassing] = useState(false)
    const droidType = useStore((state) => state.droidType);
    const type = useStore((state) => state.type);
    const gameOneFight = useStore((state) => state.gameOneFight);

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
        <svg onPointerDown={()=>{
            useStore.getState().setPage("game_play")
        }} x={"100%"} transform={"translate(-100 -80)"} y={"100%"} >
            <Btn x={0} y={0} scale={0.2} text={"ИГРАТЬ"} tx={80} />
        </svg>
        <g transform={"translate(-50 0)"}>
            <text x={"50%"} y={30} fill={"white"} fontSize={20}>ОДИНОЧНАЯ ИГРА</text>
        </g>
        <svg x={"50%"} transform={`translate(-${width > 1024?250:height > 660 && width < 500?130:170} 40)`}>
            <g transform={`scale(${height > 660 && width < 500?0.3:0.4})`}>
                <path  d="M20.0273 0L394.861 0L417.579 21.4552L417.579 95.9172L410.832 100.009L410.832 168.269L417.579 173.819L417.579 241.269L399.442 260.454L20.0273 260.62L0 241.269L0 173.973L4.99805 168.269L4.99805 100.24L0 95.8084L0 21.6221L20.0273 0Z" fill="none" strokeWidth="5" stroke="url(#gradient_game_one_box)" transform="translate(2.5 2.5)" />
                <text  x={20} y={50} fill={"#A7EAF2"} fontSize={50}>СХВАТКА: БОТЫ</text>
                <text  x={20} y={100} fill={"#A7EAF2"} fontSize={30}>БОТЫ: {gameOneFight.bot}</text>
                <text  x={20} y={130} fill={"#A7EAF2"} fontSize={30}>СТАНЦИЯ: {gameOneFight.station} x {gameOneFight.station}</text>
                <text  x={20} y={160} fill={"#A7EAF2"} fontSize={30}>УРОВЕНЬ: {gameOneFight.level}</text>
                <g>
                    <Btn x={150} y={170} scale={0.35} text={"Настройки"} tx={35} fontSize={80}/>
                </g>
            </g>


        </svg>
        <svg x={"50%"} transform={`translate(${width > 1024?80:0} 40)`}>
            <g transform={`scale(${height > 660 && width < 500?0.3:0.4})`}>
                <path  d="M20.0273 0L394.861 0L417.579 21.4552L417.579 95.9172L410.832 100.009L410.832 168.269L417.579 173.819L417.579 241.269L399.442 260.454L20.0273 260.62L0 241.269L0 173.973L4.99805 168.269L4.99805 100.24L0 95.8084L0 21.6221L20.0273 0Z" fill="none" strokeWidth="5" stroke="url(#gradient_game_one_box)" transform="translate(2.5 2.5)" />
                <text  x={20} y={50} fill={"#A7EAF2"} fontSize={50}>ПРОХОЖДЕНИЕ</text>
                <text  x={20} y={100} fill={"#A7EAF2"} fontSize={30}>БОТЫ: {gameOneFight.bot}</text>
                <text  x={20} y={130} fill={"#A7EAF2"} fontSize={30}>СТАНЦИЯ: {gameOneFight.station} x {gameOneFight.station}</text>
                <text  x={20} y={160} fill={"#A7EAF2"} fontSize={30}>УРОВЕНЬ: {gameOneFight.level}</text>
            </g>
        </svg>
        <svg onPointerDown={()=>{
            setFight(true)
            setPassing(false)
        }} x={"50%"} y={"150"}   transform={`translate(-80 ${width < 1024?70:0})`} >
            <Btn active={fight} x={0} y={0} scale={0.2} text={"СХВАТКА"} tx={90} ty={160} fontSize={66} />
        </svg>
        <svg onPointerDown={()=>{
            setPassing(true)
            setFight(false)
        }} x={"50%"} y={"150"} transform={`translate(10 ${width < 1024?70:0})`} >
            <Btn active={passing} x={0} y={0} scale={0.2} text={"ПРОХОЖДЕНИЕ"} tx={20} ty={160} fontSize={66} />
        </svg>

        <svg width="270" height={"100"} y={250} x={"50%"}  transform={`translate(-135 ${width < 1024?50:0}) `}   fill="none">
            <g style={{transition:"1s"}} transform={`translate(${step} 0)`}>
                {droidType.map((el,i)=><g key={i + "droid"} onPointerDown={()=>{
                    useStore.getState().setType(el.type)
                }} transform={`translate(${i * 90} 0.5) scale(0.3)`}>
                    <path d="M11.4334 221.211L0 211.097L11.4334 136.771L16.6017 134.467L24.523 82.1783L28.9743 79.1227L36.8406 23.0302L63.1606 0L229.85 0L255.219 22.1725L260.967 79.1227L265.562 84.7265L278.11 211.097L270.051 221.211L240.093 221.211L234.483 211.097L185.204 211.097L180.048 216.037L148.813 216.037L140.625 211.097L68.2196 212.924L60.336 221.211L11.4334 221.211Z" fill="#64828D" fillRule="evenodd" strokeWidth="1" stroke="#8DC0C2" transform="scale(1 1)" />
                    <path d="M9.31017 180.131L0 171.895L9.31017 111.372L13.5187 109.495L19.9689 66.9172L23.5936 64.4291L29.9991 18.7533L51.4312 0L187.166 0L207.823 18.0549L212.504 64.4291L216.245 68.9922L226.463 171.895L219.901 180.131L195.506 180.131L190.938 171.895L150.81 171.895L146.612 175.917L121.178 175.917L114.51 171.895L55.5507 173.383L49.1312 180.131L9.31017 180.131Z" fill="#364D5A" fillRule="evenodd" transform="matrix(1 0 0 1 26.319 20.703)" />
                    <g transform={"scale(2) translate(21 15)"}>
                        <SpaceDroidToken  type={el.type} name={el.name} color={el.color} />
                    </g>
                </g>)}
            </g>

            <g onPointerDown={()=>{
                setStep((st)=>st <= 0 && st >= -(droidType.length - 2) * 90?st - 270:0)
            }} transform={`translate(250 25) scale(0.3)`} fill="none">
                <path style={styles.arrow} className={"box"} d="M30.5 0L61 53L0 53L30.5 0Z" fill="#2C6C78" fillRule="evenodd" strokeWidth="4" stroke="#A7EAF2" transform="matrix(0 1 -1 0 55 2)" />
            </g>
            <g  onPointerDown={()=>{
                setStep((st)=>st <= droidType.length * 90 && st !== 0?st + 270:0)
            }} transform={`translate(0 25) scale(0.3) rotate(-180 30 30)`} fill="none">
                <path style={styles.arrow} className={"box"} d="M30.5 0L61 53L0 53L30.5 0Z" fill={"#2C6C78"} fillRule="evenodd" strokeWidth="4" stroke="#A7EAF2" transform="matrix(0 1 -1 0 55 2)" />
            </g>
        </svg>
        <g  transform={`scale(1) translate(${(width / ratio) / 2 - 50} ${width < 1024?150:40})`}>
            {droidType.filter((el)=>el.type === type).map((el,i)=><SpaceDroidToken key={i + "droidView"} type={el.type} name={el.name} color={el.color}/>)}
        </g>
        <g onPointerDown={()=>{
            useStore.getState().setPage("drone_settings")
        }} transform={`translate(${(width / ratio) / 2} ${width < 1024?180:100})`}>
            <Btn x={25} y={0} scale={0.15} text={"Изменить"} ty={158} tx={50} fontSize={80}/>
        </g>
    </g>
}



const styles = {
    arrow:{
        transition:"0.2s"
    }
}