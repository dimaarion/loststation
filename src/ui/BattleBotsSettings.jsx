import useStore from "../store.js";
import Btn from "./Btn.jsx";
import {useEffect} from "react";


export default function BattleBotsSettings({setDown}){
    const size = useStore((state) => state.size);
    const ratio = useStore((state) => state.ratio);
    const setGame = useStore((state) => state.setGame);
    const game = useStore((state) => state.game);
    const botCount = game.players.length - 1
    const base = game.baseFight
    const baseSize = base  + " x " + base

    useEffect(() => {
        console.log(game.players)
    }, []);
    return <g>
        <defs>
            <linearGradient id="gradient_bat_1" gradientUnits="userSpaceOnUse" x1="535.214" y1="43.671" x2="0.197" y2="43.671">
                <stop offset="0.13" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="1" stopColor="#74B6C2" />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="#0C1921" fillRule="evenodd" />
        <g>
            <rect width="500" height="500" fill="url(#bg_game_one)" fillRule="evenodd" strokeWidth={10} stroke={"#1C2833"} transform={'rotate(45 250 250)'} />
        </g>
        <g transform={"translate(-50 0)"}>
            <text x={"50%"} y={30} fill={"white"} fontSize={20}>НАСТРОЙКИ</text>
        </g>
        <g transform={'scale(0.5)'}>
            <g transform={`translate(${size.width / ratio / 2} 100)`}>
                    <g>
                        <path d="M10.1785 5.7749L0 15.5017L0.343536 78.9629L10.0018 87.8353L535.431 87.805L535.286 0L10.1785 5.7749Z" fill="none" strokeWidth="10" stroke="url(#gradient_bat_1)" transform="translate(5 5)" />
                        <g transform={`translate(25 30)`}>
                            <g>
                                <text x={0} y={30} fill={"white"} fontSize={30}>БОТЫ</text>
                            </g>
                            <g onPointerDown={()=>setGame(
                                {...game, players:game.players.length > 2?game.players.slice(0, -1):game.players}
                            )} transform={`translate(100 0)`}>
                                <path d="M0 3.07816L2.30859 0L36.8018 0L36.8018 29.3965L28.7192 40.2734L0 39.974L0 3.07816Z" fill="#27414F" strokeWidth="3" stroke="#74B6C2" strokeLinejoin="round" transform="translate(1.5 1.5)" />
                                <text x={12} y={35} fill={"white"} fontSize={50}>-</text>
                            </g>
                            <g onPointerDown={()=>setGame(
                                {...game, players:[...game.players,{id: game.players[game.players.length - 1].id + 1, name: 'Механоид ИИ-88', x: 0, y: 0, color: '#FF9900', stepsLeft: 0,treasure:0, type:"II-88", isAI: true }]}
                            )} transform={`translate(250 0)`}>
                                <path d="M0 3.07816L2.30859 0L36.8018 0L36.8018 29.3965L28.7192 40.2734L0 39.974L0 3.07816Z" fill="#27414F" strokeWidth="3" stroke="#74B6C2" strokeLinejoin="round" transform="translate(1.5 1.5)" />
                                <text x={12} y={32} fill={"white"} fontSize={33}>+</text>
                            </g>
                            <g transform={`translate(150 1)`}>
                                <rect width={90} height={40} fill="#27414F" strokeWidth="3" stroke="#74B6C2" strokeLinejoin="round" />
                                <text x={50 -  botCount.toString().length * 8} y={30} fill={"white"} fontSize={25}>{botCount}</text>
                            </g>
                             </g>

                    </g>
                    <g transform={`translate(0 120)`}>
                        <path d="M10.1785 5.7749L0 15.5017L0.343536 78.9629L10.0018 87.8353L535.431 87.805L535.286 0L10.1785 5.7749Z" fill="none" strokeWidth="10" stroke="url(#gradient_bat_1)" transform="translate(5 5)" />
                        <g transform={`translate(25 30)`}>
                            <g>
                                <text x={0} y={30} fill={"white"} fontSize={30}>СТАНЦИЯ</text>
                            </g>
                            <g onPointerDown={()=> {
                                setGame({...game,baseFight:game.baseFight > 5?game.baseFight - 5:5,levelFight:Math.round(game.baseFight)})
                            }} transform={`translate(100 0)`}>
                                <path d="M0 3.07816L2.30859 0L36.8018 0L36.8018 29.3965L28.7192 40.2734L0 39.974L0 3.07816Z" fill="#27414F" strokeWidth="3" stroke="#74B6C2" strokeLinejoin="round" transform="translate(1.5 1.5)" />
                                <text x={12} y={35} fill={"white"} fontSize={50}>-</text>
                            </g>
                            <g onPointerDown={()=> {
                                setGame({...game,baseFight:game.baseFight + 5,levelFight:Math.round(game.baseFight)})
                            }}  transform={`translate(250 0)`}>
                                <path d="M0 3.07816L2.30859 0L36.8018 0L36.8018 29.3965L28.7192 40.2734L0 39.974L0 3.07816Z" fill="#27414F" strokeWidth="3" stroke="#74B6C2" strokeLinejoin="round" transform="translate(1.5 1.5)" />
                                <text x={12} y={32} fill={"white"} fontSize={33}>+</text>
                            </g>
                            <g transform={`translate(150 1)`}>
                                <rect width={90} height={40} fill="#27414F" strokeWidth="3" stroke="#74B6C2" strokeLinejoin="round" />
                                <text x={50 -  baseSize.toString().length * 4.7} y={30} fill={"white"} fontSize={25}>{baseSize}</text>
                            </g>
                        </g>

                    </g>
                    <g transform={`translate(0 240)`}>
                        <g transform={`translate(25 30)`}>
                            <g onPointerDown={()=>setDown(false)}>
                                <Btn x={300} y={50} scale={0.35} text={"Закрыть"} tx={60} fontSize={80}/>
                            </g>
                        </g>
                    </g>
                </g>
        </g>

    </g>
}

