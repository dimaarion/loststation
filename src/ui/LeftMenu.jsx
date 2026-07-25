import useStore from "../store.js";

export default function LeftMenu({active= false}){
    const page = useStore((state) => state.page);
    const game = useStore((state) => state.game);
    const setPage = useStore((state) => state.setPage);
    return <g>

        <g style={styles.mainContainer} transform={`translate(${active?0:-300}, 50)`}>
            <rect width={150} height={500} opacity={0.5} fill={"#152C3A"}/>
            <text onPointerDown={()=>{
                setPage("game_one")
            }} x={20} y={20} className={"menu-content"} fill={game.type === "game-bot"?"#ffffff":"#A7EAF2"} fontSize={20} filter={"url(#filter_btn_3)"}>
                ОДИНОЧНАЯ ИГРА
            </text>
            <text x={20} y={45} className={"menu-content"} fill={"#A7EAF2"} fontSize={20} filter={"url(#filter_btn_3)"}>
                ИГРА С ДРУГОМ
            </text>
            <text x={20} y={70} className={"menu-content"} fill={"#A7EAF2"} fontSize={20} filter={"url(#filter_btn_3)"}>
                СЕТЕВАЯ ИГРА
            </text>
            <text x={20} y={95} className={"menu-content"} fill={"#A7EAF2"} fontSize={20} filter={"url(#filter_btn_3)"}>
                НАСТРОЙКИ
            </text>
        </g>
    </g>
}

const styles = {
    mainContainer: {
        transition:"0.5s"
    }
}