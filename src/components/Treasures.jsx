import {
    AlienArtifact,
    EnergyCore,
    GravityBoosterIcon,
    PlasmaCutterIcon,
    QuantumWrenchIcon, SpaceTileChip, SpaceTileGenerator, SpaceTileLogData,
    VoidRadarIcon
} from "./Objects.jsx";
import SpaceTileExit from "./SpaceTileExit.jsx";
import SpaceTileSector from "./SpaceTileSector.jsx";
import SpaceTilePortal from "./SpaceTilePortal.jsx";


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
         case 'next':
             return <svg x={20} y={20} width={50} height={50} viewBox={"0 0 100 100"}><SpaceTileExit translate={{x: 0, y: 0}} player={{x:0,y:0}} /></svg>
         case 'sector':
             return <svg x={20} y={20} width={50} height={50} viewBox={"0 0 100 100"}><SpaceTileSector translate={{x: 0, y: 0}} player={{x:0,y:0}} /></svg>
         case 'portal':
             return <svg x={20} y={20} width={50} height={50} viewBox={"0 0 100 100"}><SpaceTilePortal translate={{x: 0, y: 0}} player={{x:0,y:0}} /></svg>
         case 'nav_chip':
             return <SpaceTileChip size={60}/>
        default:
            return null
    }
}