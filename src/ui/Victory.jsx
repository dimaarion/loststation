import MenuBg from "./MenuBg.jsx";
import useStore from "../store.js";
import {useMemo, useState} from "react";
import {generateMaze, getMaxResult} from "../action.js";
import Btn from "./Btn.jsx";

export default function Victory(){
    const size = useStore((state)=>state.size)
    const ratio = useStore((state)=>state.ratio)
    const game = useStore((state)=>state.game)
    const pointsGame = useStore((state)=>state.pointsGame)
    const stars = useStore((state) => state.stars);
    const [offset, setOffset] = useState(0);
    const [touchStart, setTouchStart] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientY);
    };

    const handleWheel = (e) => {
        // e.deltaY > 0 — прокрутка вниз, < 0 — вверх
        setOffset((prev) => {
            const next = prev + e.deltaY;
            // ограничиваем минимумом 0
            return Math.max(0, Math.min(next, game.players.length * 35));
        });
    };

    const handleTouchMove = (e) => {
        const delta = touchStart - e.touches[0].clientY;
        setOffset((prev) => Math.max(0, Math.min(prev + delta, game.players.length * 35)));
        setTouchStart(e.touches[0].clientY);
    };

    const title = useMemo(() => {
        const scores = game.players.map((_, idx) =>
            pointsGame.filter((f) => f === idx).length
        );
        const maxScore = Math.max(...scores);
        const player0Score = pointsGame.filter((f) => f === 0).length;
        return maxScore === player0Score ? "ПОБЕДА" : "ПОРАЖЕНИЕ";
    }, [game.players, pointsGame]);


    const players = useMemo(()=>{
        let p = []
        game.players.forEach((el,index)=>{
            p[index] = {
                name:el.name,
                color:el.color,
                treasure:pointsGame.filter((f)=>f === index).length
            }
        })
        return p.sort((a, b) => b.treasure - a.treasure);
    },[game.players, pointsGame])

    return<g onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove} onWheel={handleWheel} transform={`translate(${size.width / ratio / 2 - 142} ${size.height / ratio / 2 - 102})`}>
        <rect x={-size.width / ratio / 2 + 142} y={-size.height / ratio / 2 + 102} width={"100%"} height={"100%"} fill={"#000"} />
        <g transform={`translate(${-size.width / ratio / 2 - 142} ${-size.height / ratio / 2 - 102})`}>
            {stars.map((el,i)=> <g key={i + "star-victory"} transform={`translate(${el.position.x} ${el.position.y}) scale(${el.scale / 300})`} width={50} height={50}>
                <path d="M0 10C0 4.47716 4.47716 0 10 0C15.5228 0 20 4.47716 20 10C20 15.5228 15.5228 20 10 20C4.47716 20 0 15.5228 0 10Z" fill="#FFFFFF" fillRule="evenodd" filter="url(#filter_1)" transform="translate(15 15)" />
            </g>)}
        </g>

        <g transform={`scale(0.3)`}>
            <MenuBg/>
        </g>
        <g >
            <text x={115 - title.length * 0.5} y={30} fill={"white"} fontSize={20}>{title}</text>
            <svg y={40} width={"250"} height={"110"}>
                <g transform={"translate(0 5)"}>
                    <g style={styles.slider} transform={`translate(42 ${-offset})`}>
                        <rect  x={-5} y={-5} fill={"#0C3C4C"}  width={210} height={game.players.length * 40} />
                        {players.map((el,idx)=><g key={idx + "players-victory"} transform={`translate(0 ${idx * 35})`}>
                            <rect width={el.treasure * 100 / (game.level + 0.5)} rx={2} height={5} y={25} fill={el.color} />
                            <text x={0} y={10} fill={"#A7EAF2"} fontSize={10}>{idx + 1}. {el.name}</text>
                            <text x={0} y={20} fill={"#A7EAF2"} fontSize={10}>Сокровищ собрано - {el.treasure}</text>
                        </g>)}
                    </g>
                </g>
            </svg>
            <g onPointerDown={()=>{
                useStore.getState().setPage(game.page)
                useStore.getState().setMaze(generateMaze(game.base, game.level))
                useStore.getState().setGamePlayerPositionRestart()
                useStore.getState().setGamePhase("")
            }} transform={"translate(113 150)"}>
                <Btn x={0} y={0} scale={0.2} text={"Закрыть"} fontSize={80} active={false} tx={65} ty={160} />
            </g>

        </g>
    </g>
}

const styles = {
    slider:{
        transition:"0.5s"
    },
    thumb:{
        transition:"0.5s"
    }
}