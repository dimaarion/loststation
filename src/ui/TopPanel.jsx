import {useState} from "react";
import useStore from "../store.js";
import LeftMenu from "./LeftMenu.jsx";
import {CreditChip} from "../components/Objects.jsx";

export default function TopPanel({players, count = 0, countTotal = 0, currentIndex = 0}){
        const [active, setActive] = useState(false);

         const message = useStore((state) => state.message);
         const game = useStore((state) => state.game);
         const pause = useStore((state) => state.pause);
         const credits = useStore((state) => state.credits);
    return <g>
        <LeftMenu active={active} />
        <rect width={"100%"} height={50} opacity={0.5} fill={"#152C3A"}/>
        <text fontSize={15} x={"50%"} transform={'translate(-8 0)'} y={15} fill={"#a7cde4"}> {count} / {countTotal}</text>
        <text fontSize={15} x={"50%"} transform={`translate(${-message.length * 2.5} 0)`} y={35} fill={"#FFB700"}>{message}</text>
        <g transform={`translate(15 16)`}>
            <g  onPointerDown={()=>{
        setActive(!active)
                useStore.getState().setPause(!pause)
    }}  transform={`rotate(${active?90:0} 0 0) translate(-8 -8)`} style={styles.menuBtn}  width="16" height="16" fill="#a7cde4">
                <rect width={16} height={16} fill={"#152C3A"}/>
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </g>

        </g>
        <g>
            <text x={8} y={40} fill={"#A7EAF2"} fontSize={15} filter={"url(#filter_btn_3)"}>Игроки: {game.players.length}</text>
        </g>
        <g transform={`translate(${15} ${-10})`}>
            <g>
                <CreditChip width={45} height={45}  />
                <text fill={"#FFB700"} fontSize={15} filter={"url(#filter_btn_3)"} transform={`translate(${35} ${32})`}>{credits}</text>
            </g>

        </g>

    </g>
}

const styles = {
        menuBtn:{
            transition:"0.5s"
        }
}