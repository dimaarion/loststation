export const SpaceDroidToken = ({ color = '#00F0FF' }) => {
    return (
        <g transform="translate(50, 50)">
            {/* Тень под дроидом для объема */}
            <circle cx="0" cy="4" r="18" fill="#000" opacity="0.4" />

            {/* Механический корпус дроида */}
            <circle cx="0" cy="0" r="18" fill="#2D3748" stroke="#4A5568" strokeWidth="2" />
            <circle cx="0" cy="0" r="14" fill="#1A202C" stroke="#2D3748" strokeWidth="1" />

            {/* Внешние технические пазы/шасси (4 симметричных элемента) */}
            <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(0)" />
            <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(90)" />
            <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(180)" />
            <rect x="-20" y="-3" width="4" height="6" rx="1" fill="#4A5568" transform="rotate(270)" />

            {/* Центральный светящийся фотонный глаз/локатор */}
            <circle cx="0" cy="0" r="6" fill={color} opacity="0.3" />
            <circle cx="0" cy="0" r="4" fill="#FFF" />

            {/* Направление взгляда (маленькая неоновая точка-антенна впереди) */}
            <circle cx="0" cy="-10" r="2" fill={color} />
        </g>
    );
};