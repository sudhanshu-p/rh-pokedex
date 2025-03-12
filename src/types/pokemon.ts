/** Contains Basic details */
export interface PokemonListItem {
    id: number;
    name: string;
    image: string;
    types: string[];
    /** Should be in Meter */
    height: number;
    /** Should be in Kilos */
    weight: number;
}

/** In depth details */
export interface PokemonDetail extends PokemonListItem {
    stats: PokemonStat[];
    abilities: string[];
    moves: string[];
}

export interface PokemonStat {
    name: string;
    value: number;
}

export interface ApiResponse<T> {
    loading: boolean;
    error: string | null;
    data: T | null;
}