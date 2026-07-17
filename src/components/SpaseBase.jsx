import SpaceTileStraight from "./SpaceTileStraight.jsx";
import SpaceTileTShape from "./SpaceTileTShape.jsx";
import SpaceTileCorner from "./SpaceTileCorner.jsx";

export default function SpaseBase({type, translate, rotation, onClick, treasure, player}) {

    switch (type) {
        case 'straight':
            return <SpaceTileStraight player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 't_shape':
            return <SpaceTileTShape player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        case 'corner':
            return <SpaceTileCorner player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
        default:
                return <SpaceTileStraight player={player} treasure={treasure} onClick={onClick} translate={translate} angle={rotation} />
    }
}