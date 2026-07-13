import SpaceTileStraight from "./SpaceTileStraight.jsx";
import SpaceTileTShape from "./SpaceTileTShape.jsx";
import SpaceTileCorner from "./SpaceTileCorner.jsx";

export default function SpaseBase({type, translate, rotation, onClick, treasure}) {
    switch (type) {
        case 'straight':
            return <SpaceTileStraight treasure={treasure} onClick={onClick} translate={translate} rotation={rotation} />
        case 't_shape':
            return <SpaceTileTShape treasure={treasure} onClick={onClick} translate={translate} rotation={rotation} />
        case 'corner':
            return <SpaceTileCorner treasure={treasure} onClick={onClick} translate={translate} rotation={rotation} />
        default:
                return <SpaceTileStraight treasure={treasure} onClick={onClick} translate={translate} rotation={rotation} />
    }
}