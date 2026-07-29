import SpaceTileStraight from "./SpaceTileStraight.jsx";
import SpaceTileTShape from "./SpaceTileTShape.jsx";
import SpaceTileCorner from "./SpaceTileCorner.jsx";
import SpaseTileBlocking from "./SpaseTileBlocking.jsx";
import SpaceTileGateway from "./SpaceTileGateway.jsx";

export default function SpaseBase({type, translate, rotation, onClick, treasure, player, complete = false}) {

    switch (type) {
        case 'straight':
            return <SpaceTileStraight player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 't_shape':
            return <SpaceTileTShape player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 'corner':
            return <SpaceTileCorner player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 'blocking':
            return <SpaseTileBlocking  player={player}  onClick={onClick} translate={translate} angle={rotation} />
        case 'gateway':
            return <SpaceTileGateway complete={complete}  onClick={onClick} translate={translate} angle={rotation} />
        default:

    }
}