export function getTypeColor(type: string) {
    const typeColors = {
        normal: "168, 168, 120",
        fire: "240, 128, 48",
        water: "104, 144, 240",
        electric: "248, 208, 48",
        grass: "120, 200, 80",
        ice: "152, 216, 216",
        fighting: "192, 48, 40",
        poison: "160, 64, 160",
        ground: "224, 192, 104",
        flying: "168, 144, 240",
        psychic: "248, 88, 136",
        bug: "168, 184, 32",
        rock: "184, 160, 56",
        ghost: "112, 88, 152",
        dragon: "112, 56, 248",
        dark: "112, 88, 72",
        steel: "184, 184, 208",
        fairy: "238, 153, 172",
    };

    return typeColors[type] || "#777777";
}

export function getTypeSVG(type: string, fillColor: string | null = null) {
    if (!fillColor) {
        fillColor = getTypeColor(type)
    }
    const typeSVGs = {
        normal:
            `
            <svg width="512" height="512" viewBox="0 0 512 512" fill=${fillColor} xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M481 256C481 380.264 380.264 481 256 481C131.736 481 31 380.264 31 256C31 131.736 131.736 31 256 31C380.264 31 481 131.736 481 256ZM384.571 256C384.571 327.008 327.008 384.571 256 384.571C184.992 384.571 127.429 327.008 127.429 256C127.429 184.992 184.992 127.429 256 127.429C327.008 127.429 384.571 184.992 384.571 256Z" fill="white"/>
            </svg>
        `
    }
}