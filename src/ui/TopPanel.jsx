import {useState} from "react";
import useStore from "../store.js";

export default function TopPanel({players, count = 0, countTotal = 0, currentIndex = 0}){
        const [active, setActive] = useState(false);
         const page = useStore((state) => state.page);
    return <g>
        <rect width={"100%"} height={50} opacity={0.5} fill={"#152C3A"}/>
        {page === "game_play"?<text fontSize={15} x={"50%"} transform={'translate(-8 0)'} y={30}
               fill={"#a7cde4"}> {count} / {countTotal}</text>:""}
        <g transform={`translate(15 16)`}>
            <g  onPointerDown={()=>{
        setActive(!active)
    }}  transform={`rotate(${active?90:0} 0 0) translate(-8 -8)`} style={styles.menuBtn}  width="16" height="16" fill="#a7cde4">
                <rect width={16} height={16} fill={"#152C3A"}/>
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </g>
        </g>

    </g>
}

const styles = {
        menuBtn:{
            transition:"0.5s"
        }
}