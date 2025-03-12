<script>
    export let pokemon;
    import { createEventDispatcher, onMount } from "svelte";
    import { getTypeColor } from "../utils/helper";

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch("select", pokemon);
    }

    // Helper function to format Pokémon ID
    function formatId(id) {
        return `#${id.toString().padStart(3, "0")}`;
    }

    onMount(async () => {
        
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="card" on:click={handleClick}>
    <div
        class="card-image"
        style="background-color: rgb({getTypeColor(pokemon.type[0])});"
    >
        <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
    </div>
    <div class="card-info">
        <span class="pokemon-id">{formatId(pokemon.id)}</span>
        <h2 class="pokemon-name">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h2>
        <div class="pokemon-types">
            {#each pokemon.type as type}
                <span
                    class="type-badge"
                    style="background-color: rgb({getTypeColor(type)})"
                >
                    {type}
                </span>
            {/each}
        </div>
    </div>
</div>

<style>
    .card {
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        cursor: pointer;
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .card-image {
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 140px;
        background-color: #f0f0f0;
    }

    .card-image img {
        width: 120px;
        height: 120px;
        object-fit: contain;
    }

    .card-info {
        padding: 1rem;
        position: relative;
    }

    .pokemon-id {
        position: absolute;
        top: 1rem;
        right: 1rem;
        color: #888;
        font-size: 0.9rem;
    }

    .pokemon-name {
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
        font-weight: bold;
    }

    .pokemon-types {
        display: flex;
        gap: 0.5rem;
    }

    .type-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        color: white;
        text-transform: capitalize;
    }
</style>
