import useStore from "../store.js";
import {CreditChip} from "../components/Objects.jsx";
import {useSpring,animated} from "@react-spring/web";
import Btn from "./Btn.jsx";
import Treasures from "../components/Treasures.jsx";
import {getObjectivesTarget} from "../action.js";

export default function MessageLevel(){
    const quests = useStore((state) => state.quests);
    const game = useStore((state) => state.game);
    const questTarget = useStore((state) => state.questTarget);
    const selectLevel = useStore((state) => state.selectLevel);

    const questLevel = quests.filter((el)=>el.sectorId === game.selectLevel).find((el)=>el).levels.find((el)=>el.id === game.id)
    const[ translate,api] = useSpring(()=>({
        from:{transform:`translate(-500px, 0px)`},
        to:[{transform:`translate(0px, 0px)`}],
        config:{duration:1000},
        loop:false
    }),[])

    const[ translateBtn,apiBtn] = useSpring(()=>({
        from:{transform:`translate(0px, 0px)`},
        to:[{transform:`translate(-500px, 0px)`}],
        config:{duration:1000},
        loop:false
    }),[])

    return <g transform={`translate(0 50)`}>
        <animated.g style={translateBtn}>
            <g onPointerDown={()=>{
                api({
                    to:{transform:`translate(0px, 0px)`}
                })
                apiBtn({
                    to:{transform:`translate(-500px, 0px)`}
                })
            }}>
                <Btn x={0} y={-18} scale={0.2} fontSize={70} text={"Задание"} ty={155} tx={80} />
                <rect x={0} rx={8} y={20} height={20} width={30} stroke={"url(#gradient_btn_2)"} strokeWidth={1} fill={"url(#gradient_btn_1)"}/>
                <text x={14 - questTarget.toString().length * 2}  y={34} fontSize={15} fill={"#a7cde4"}>{questTarget}</text>
            </g>

        </animated.g>

        <animated.g style={translate}>
            <g transform="translate(0.5 0.5)">
                <path d="M30.9119 0L34.0258 1.9058L70.022 1.9058L70.9944 0.96018L126.344 0.96018L127.641 1.9058L163.446 1.9058L166.08 0L183.782 0L193 6.52718L193 28.2589L190.088 30.5061L190.088 75.825L193 78.3506L193 94.0597L184.915 99.9602L8.01632 99.9602L0 94.0597L0 78.2386L2.81022 75.825L2.81022 30.4317L0 28.4095L0 6.52485L9.39737 0L30.9119 0Z" fill="#6A98A8" fillRule="evenodd" strokeWidth="1" stroke="#808080" transform="scale(1 1)" />
                <path d="M5.52864 93.4226L0 89.2285L0 4.81241L6.6556 0L175.531 0L182.305 4.81241L182.305 89.2045L176.536 93.4226L5.52864 93.4226Z" fill="#274957" fillRule="evenodd" strokeWidth="4" stroke="#5DC9D6" transform="matrix(1 0 0 1 5.278 3.254)" />
                <g transform={'translate(20 25)'}>
                    <text x={0} y={0} fill={"#a7cde4"} fontSize={20}>{questLevel.title}</text>
                    <text x={0} y={12} fill={"#a7cde4"} fontSize={10}>{questLevel.objectives.main.text}</text>
                    <g transform={'translate(-12 25)'}>
                        <CreditChip width={45} height={45}  />
                        <text fill={"#FFB700"} fontSize={15} filter={"url(#filter_btn_3)"} transform={`translate(${35} ${32})`}>{questLevel.rewards.completionCredits}</text>
                    </g>
                </g>
                <g onPointerDown={()=>{
                    api({
                        to:{transform:`translate(-500px, 0px)`}
                    })
                    apiBtn({
                        to:{transform:`translate(0px, 0px)`}
                    })
                }}>
                    <Btn x={110} y={50} scale={0.2} fontSize={70} text={"Закрыть"} ty={155} tx={80} />
                </g>
                <g transform={"scale(0.6) translate(225 40)"}>
                    <Treasures  treasure={questLevel.fixedTreasures.type}/>
                </g>
                <rect x={20} y={45} rx={8} fill={"#000"} width={70} height={20} />
                <text x={25} y={61} fontSize={20} fill={"#a7cde4"}>{questTarget}</text>
                <text x={115} y={61} fontSize={20} fill={"#a7cde4"}>{getObjectivesTarget(quests,game)}</text>

            </g>
        </animated.g>

    </g>
}