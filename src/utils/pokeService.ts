// src/services/pokemonService.ts
import axios from 'axios';

export interface Pokemon {
    id: number;
    name: string;
    type: string[];
    image: string;
    height: number;
    weight: number;
    abilities: string[],
    moves: string[],
    stat: {
        name: string,
        value: number
    }
}

// In-memory cache
const pokemonCache: Record<number, Pokemon> = {};
const pokemonByName: Record<string, number> = {};
const pokemonByType: Record<string, number[]> = {};

// Object of names and URLs
let PokemonNameToUrlPointer: [] = []

function __getIdFromURL(url: string) {
    const tempArray = url.split('/')
    return tempArray[tempArray.length - 2]
}

export async function initializePokemon(limit = 20) {
    // If it is already initialized, return
    if (Object.keys(pokemonCache).length > 0) return;

    try {
        // Get pokemon count
        let response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1`);
        const pokeCount = response.data.count

        // Get ID all <pokeCount> pokemon
        response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${pokeCount}`);
        const results = response.data.results

        PokemonNameToUrlPointer = [...results]
        // Store name-id pair in the cache
        results.forEach((pokemon: { url: string; name: string; }) => {
            const pokemonId = __getIdFromURL(pokemon.url)
            pokemonByName[pokemon.name.toLowerCase()] = +pokemonId;
        })

        // Get types count
        const typeResponse = await axios.get(`https://pokeapi.co/api/v2/type`)
        const typeData = typeResponse.data.results

        await Promise.all(typeData.map(async (entry: any) => {
            const typeDataResponse = await axios.get(entry.url);
            const data = typeDataResponse.data;

            const currentType = data.name
            const typedPokemon = data.pokemon

            // Store type - [id] 
            typedPokemon.forEach((pokemonOfType) => {
                if (!pokemonByType[currentType]) pokemonByType[currentType] = [];
                const pokemonOfTypeId = __getIdFromURL(pokemonOfType.pokemon.url)

                pokemonByType[currentType].push(+pokemonOfTypeId)
            })
        }));

        // Store the entire data of first limit pokemon
        await Promise.all(results.splice(0, limit).map(async (entry: any) => {
            const pokemonResponse = await axios.get(entry.url);
            const data = pokemonResponse.data;
            const pokemon: Pokemon = {
                id: data.id,
                name: data.name,
                type: data.types.map((t: any) => t.type.name),
                image: data.sprites.other.dream_world.front_default || data.sprites.other["official-artwork"].front_default,
                height: data.height,
                weight: data.weight,
                abilities: data.abilities.map((ability: { ability: { name: any; }; }) => ability.ability.name),
                moves: data.moves.map((move: { move: { name: any; }; }) => move.move.name),
                stat: data.stats.map((stat: { stat: { name: any; }; base_stat: string | number; }) => ({
                    name: stat.stat.name,
                    value: +stat.base_stat
                }))
            };

            // Add to caches
            pokemonCache[pokemon.id] = pokemon;
        }));

        // Leaving this console statements here to make it easier to visualize in the future
        // console.log(pokemonCache)
        // console.log(pokemonByName)
        // console.log(pokemonByType)
    } catch (error) {
        console.error('Failed to initialize pokemon data:', error);
    }
}

export async function loadMorePokemon(limit = 20, offset = 20): Promise<Pokemon[]> | null {
    // PokemonNameToUrlPointer
    const ids = PokemonNameToUrlPointer.map(data => __getIdFromURL(data.url)).slice(offset, offset + limit)
    await Promise.all(ids.map(async (id: any) => {
        // If the data is stored, continue
        if (id in pokemonCache) {
            return
        }
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = pokemonResponse.data;

        const pokemon: Pokemon = {
            id: data.id,
            name: data.name,
            type: data.types.map((t: any) => t.type.name),
            image: data.sprites.other.dream_world.front_default || data.sprites.other["official-artwork"].front_default,
            height: data.height,
            weight: data.weight,
            abilities: data.abilities.map((ability: { ability: { name: any; }; }) => ability.ability.name),
            moves: data.moves.map((move: { move: { name: any; }; }) => move.move.name),
            stat: data.stats.map((stat: { stat: { name: any; }; base_stat: string | number; }) => ({
                name: stat.stat.name,
                value: +stat.base_stat
            }))
        };;

        // Add to caches
        pokemonCache[pokemon.id] = pokemon;
    }));
    return ids.map(id => pokemonCache[id])
}


export function getAllPokemon(): Pokemon[] | null {
    return Object.values(pokemonCache);
}

// Search functions
export function getPokemonById(id: number): Pokemon | null {
    return pokemonCache[id] || null;
}

export async function searchPokemonByName(partialName: string, limit = 20, offset = 0): Promise<Pokemon[]> {
    const searchName = partialName.toLowerCase();

    const names = Object.keys(pokemonByName).filter(name => name.includes(searchName))

    const ids = names.map(name => pokemonByName[name])
    await Promise.all(ids.map(async (id: any) => {
        // If the data is stored, continue
        if (id in pokemonCache) {
            return
        }
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = pokemonResponse.data;

        const pokemon: Pokemon = {
            id: data.id,
            name: data.name,
            type: data.types.map((t: any) => t.type.name),
            image: data.sprites.other.dream_world.front_default || data.sprites.other["official-artwork"].front_default,
            height: data.height,
            weight: data.weight,
            abilities: data.abilities.map((ability: { ability: { name: any; }; }) => ability.ability.name),
            moves: data.moves.map((move: { move: { name: any; }; }) => move.move.name),
            stat: data.stats.map((stat: { stat: { name: any; }; base_stat: string | number; }) => ({
                name: stat.stat.name,
                value: +stat.base_stat
            }))
        };;

        // Add to caches
        pokemonCache[pokemon.id] = pokemon;
    }));

    return ids.map(id => pokemonCache[id]).slice(offset, offset + limit)
}

export async function getPokemonByType(type: string, limit = 20, offset = 0): Promise<Pokemon[]> {
    const typeKey = type.toLowerCase();
    const ids = pokemonByType[typeKey] || [];
    await Promise.all(ids.map(async (id: any) => {
        // If the data is stored, continue
        if (id in pokemonCache) {
            return
        }
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = pokemonResponse.data;

        const pokemon: Pokemon = {
            id: data.id,
            name: data.name,
            type: data.types.map((t: any) => t.type.name),
            image: data.sprites.other.dream_world.front_default || data.sprites.other["official-artwork"].front_default,
            height: data.height,
            weight: data.weight,
            abilities: data.abilities.map((ability: { ability: { name: any; }; }) => ability.ability.name),
            moves: data.moves.map((move: { move: { name: any; }; }) => move.move.name),
            stat: data.stats.map((stat: { stat: { name: any; }; base_stat: string | number; }) => ({
                name: stat.stat.name,
                value: +stat.base_stat
            }))
        };;

        // Add to caches
        pokemonCache[pokemon.id] = pokemon;
    }));
    return ids.map(id => pokemonCache[id]).slice(offset, offset + limit);
}

export async function getPokemonByTypes(types: string[], limit = 20, offset = 0): Promise<Pokemon[]> {
    if (types.length === 0) return Object.values(pokemonCache).slice(offset, offset + limit);
    if (types.length === 1) return getPokemonByType(types[0], limit, offset);

    // Find pokemon with all specified types
    const [firstType, ...restTypes] = types;
    return (await getPokemonByType(firstType)).filter(pokemon =>
        restTypes.every(type => pokemon.type.includes(type))
    ).slice(offset, offset + limit);
}

export async function searchPokemon({ name, types }: { name?: string; types?: string[] }, limit = 20, offset = 0): Pokemon[] {
    // Both name and types
    if (name && types && types.length > 0) {
        // First filter by name
        const nameResults = searchPokemonByName(name);

        // Then filter by all required types
        return (await nameResults).filter(pokemon =>
            types.every(type => pokemon.type.includes(type))
        ).slice(offset, offset + limit);
    }

    // Only name
    if (name) {
        return await searchPokemonByName(name, limit, offset);
    }

    // Only types
    if (types && types.length > 0) {
        return getPokemonByTypes(types, limit, offset);
    }

    // No filters provided
    return Object.values(pokemonCache).slice(offset, offset + limit);
}

export function getAllTypes() {
    // If the app hasn't initialized yet, wait
    if (Object.keys(pokemonByType).length === 0) {
        return { data: null, error: true }
    }
    return { data: Object.keys(pokemonByType), error: null }
}

export async function getDetailedPokemonData(id: string) {

}