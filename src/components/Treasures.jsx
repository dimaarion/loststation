import {
    AlienArtifact,
    EnergyCore,
    GravityBoosterIcon,
    PlasmaCutterIcon,
    QuantumWrenchIcon, SpaceTileLogData,
    VoidRadarIcon
} from "./Objects.jsx";


export default function Treasures({treasure}){
     switch (treasure) {
        case 'alien_artifact':
            return <AlienArtifact/>
        case 'energy_core':
            return <EnergyCore />
        case 'Gravity Booster':
            return <GravityBoosterIcon size={100}/>
         case 'Quantum Wrench':
             return <QuantumWrenchIcon/>
         case 'Void Radar':
             return <VoidRadarIcon/>
         case 'Plasma Cutter':
             return <PlasmaCutterIcon/>
         case 'leg-data':
             return <SpaceTileLogData/>
        default:
            return ""
    }
}