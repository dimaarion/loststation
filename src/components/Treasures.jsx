import {
    AlienArtifact,
    EnergyCore,
    GravityBoosterIcon,
    PlasmaCutterIcon,
    QuantumWrenchIcon, SpaceTileGenerator, SpaceTileLogData,
    VoidRadarIcon
} from "./Objects.jsx";


export default function Treasures({treasure, size = 100}, active = false){
     switch (treasure) {
        case 'alien_artifact':
            return <AlienArtifact/>
        case 'energy_core':
            return <EnergyCore />
        case 'Gravity Booster':
            return <GravityBoosterIcon size={size}/>
         case 'Quantum Wrench':
             return <QuantumWrenchIcon/>
         case 'Void Radar':
             return <VoidRadarIcon/>
         case 'Plasma Cutter':
             return <PlasmaCutterIcon/>
         case 'leg-data':
             return <SpaceTileLogData/>
         case 'generator':
             return <SpaceTileGenerator size={size} active={false}  />
         case 'generator_active':
             return <SpaceTileGenerator size={size} active={true}  />
        default:
            return null
    }
}