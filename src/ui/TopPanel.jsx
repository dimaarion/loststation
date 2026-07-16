import {SpaceDroidToken} from "../components/Players.jsx";

export default function TopPanel({players, count = 0, countTotal = 0, currentIndex = 0}){
    return <g>
        <rect width={"100%"} height={50} opacity={0.5} fill={"#152C3A"} />
        <text fontSize={15} x={"50%"} transform={'translate(-15 0)'} y={15} fill={"#a7cde4"}>1 уровень</text>
        <text fontSize={15} x={"50%"} transform={'translate(-8 0)'} y={30} fill={"#a7cde4"}> {count} / {countTotal}</text>
        {players.filter((f,i)=>i === currentIndex).map((player, index) =><g
            key={player.id}
            transform={`translate(${0}, ${-5}) scale(0.7)`}>
            <SpaceDroidToken name={player.name} color={player.color} />
        </g> )}
    </g>
}