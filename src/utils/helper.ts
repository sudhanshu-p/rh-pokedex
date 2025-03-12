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