import SpaceTileStraight from "./SpaceTileStraight.jsx";
import SpaceTileTShape from "./SpaceTileTShape.jsx";
import SpaceTileCorner from "./SpaceTileCorner.jsx";
import SpaseTileBlocking from "./SpaseTileBlocking.jsx";
import SpaceTileGateway from "./SpaceTileGateway.jsx";
import SpaceTileLocked from "./SpaceTileLocked.jsx";
import SpaceTileAuto from "./SpaceTileAuto.jsx";
import SpaceTileExit from "./SpaceTileExit.jsx";
import SpaceTileSector from "./SpaceTileSector.jsx";
import SpaceTilePortal from "./SpaceTilePortal.jsx";

export default function SpaseBase({tileRotate,type, translate, rotation, onClick, treasure, player, complete = false}) {

    switch (type) {
        case 'straight':
            return <SpaceTileStraight tileRotate={tileRotate} player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 't_shape':
            return <SpaceTileTShape tileRotate={tileRotate} player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 'corner':
            return <SpaceTileCorner tileRotate={tileRotate} player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 'blocking':
            return <SpaseTileBlocking tileRotate={tileRotate}   player={player}  onClick={onClick} translate={translate} angle={rotation} />
        case 'gateway':
            return <SpaceTileGateway   complete={complete}  onClick={onClick} translate={translate} angle={rotation} />
        case 'locked':
            return <SpaceTileLocked   complete={complete} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 'auto_rotate':
            return <SpaceTileAuto    tileRotate={tileRotate} player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 'exit':
            return <SpaceTileExit   tileRotate={tileRotate} player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 'sector':
            return <SpaceTileSector   tileRotate={tileRotate} player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 'portal':
            return <SpaceTilePortal   tileRotate={tileRotate} player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        default:

    }
}