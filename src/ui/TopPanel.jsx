import {SpaceDroidToken} from "../components/Players.jsx";

export default function TopPanel({players}){
    return <g>
        <rect width={"100%"} height={50} opacity={0.5} fill={"#152C3A"} />
        <text fontSize={15} x={"50%"} transform={'translate(-15 0)'} y={25} fill={"#a7cde4"}>1 уровень</text>
        {players.map((player, index) =><g
            key={player.id}
            transform={`translate(${index * 70 - 15}, ${-5}) scale(0.7)`}>
            <text fontSize={15} x={30} y={25} fill={"#a7cde4"}>{player.name}</text>
            <SpaceDroidToken color={player.color} />
            <text fontSize={15} x={70} y={70} fill={"#a7cde4"}>{5}</text>
        </g> )}
    </g>
}