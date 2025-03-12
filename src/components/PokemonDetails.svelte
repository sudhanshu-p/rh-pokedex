<script>
    export let pokemon;
    export let onClose;
    import { getTypeColor } from "../utils/helper";

    let activeTab = "about";

    // Format ID
    function formatId(id) {
        return `#${id.toString().padStart(3, "0")}`;
    }

    // Format height and weight
    function formatHeight(height) {
        return `${(height / 10).toFixed(1)} m`;
    }

    function formatWeight(weight) {
        return `${(weight / 10).toFixed(1)} kg`;
    }

    // Get dominant type color for background
    function getDominantTypeColor() {
        if (!pokemon || !pokemon.types || pokemon.types.length === 0)
            return "#777777";
        return getTypeColor(pokemon.types[0].type.name);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-backdrop" on:click={onClose}>
    <div class="modal-content" on:click|stopPropagation>
        <button class="close-button" on:click={onClose}>✕</button>

        <div
            class="pokemon-header"
            style="background-color: {getDominantTypeColor()}"
        >
            <div class="pokemon-info">
                <h2>
                    {pokemon.name.charAt(0).toUpperCase() +
                        pokemon.name.slice(1)}
                </h2>
                <span class="pokemon-id">{formatId(pokemon.id)}</span>
                <div class="pokemon-types">
                    {#each pokemon.types as { type }}
                        <span
                            class="type-badge"
                            style="background-color: rgb({getTypeColor(type.name)})"
                        >
                            {type.name}
                        </span>
                    {/each}
                </div>
            </div>
            <div class="pokemon-image">
                <img
                    src={pokemon.sprites.other["official-artwork"]
                        .front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                />
            </div>
        </div>

        <div class="tabs">
            <button
                class:active={activeTab === "about"}
                on:click={() => (activeTab = "about")}>About</button
            >
            <button
                class:active={activeTab === "stats"}
                on:click={() => (activeTab = "stats")}>Stats</button
            >
            <button
                class:active={activeTab === "moves"}
                on:click={() => (activeTab = "moves")}>Moves</button
            >
        </div>

        <div class="tab-content">
            {#if activeTab === "about"}
                <div class="about-tab">
                    <div class="info-row">
                        <span class="label">Height</span>
                        <span class="value">{formatHeight(pokemon.height)}</span
                        >
                    </div>
                    <div class="info-row">
                        <span class="label">Weight</span>
                        <span class="value">{formatWeight(pokemon.weight)}</span
                        >
                    </div>
                    <div class="info-row">
                        <span class="label">Abilities</span>
                        <span class="value">
                            {pokemon.abilities
                                .map((a) => a.ability.name.replace("-", " "))
                                .join(", ")}
                        </span>
                    </div>
                </div>
            {:else if activeTab === "stats"}
                <div class="stats-tab">
                    {#each pokemon.stats as stat}
                        <div class="stat-row">
                            <span class="stat-name"
                                >{stat.stat.name.replace("-", " ")}</span
                            >
                            <span class="stat-value">{stat.base_stat}</span>
                            <div class="stat-bar">
                                <div
                                    class="stat-fill"
                                    style="width: {Math.min(
                                        100,
                                        (stat.base_stat / 255) * 100,
                                    )}%"
                                ></div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else if activeTab === "moves"}
                <div class="moves-tab">
                    <div class="moves-list">
                        {#each pokemon.moves.slice(0, 20) as move}
                            <span class="move-item"
                                >{move.move.name.replace("-", " ")}</span
                            >
                        {/each}
                        {#if pokemon.moves.length > 20}
                            <span class="more-moves"
                                >+ {pokemon.moves.length - 20} more moves</span
                            >
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: white;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.5);
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
    }

    .pokemon-header {
        padding: 2rem;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .pokemon-info h2 {
        margin: 0;
        font-size: 1.8rem;
    }

    .pokemon-id {
        font-size: 1rem;
        opacity: 0.8;
    }

    .pokemon-types {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .type-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        color: white;
        text-transform: capitalize;
    }

    .pokemon-image {
        width: 120px;
        height: 120px;
    }

    .pokemon-image img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .tabs {
        display: flex;
        border-bottom: 1px solid #ddd;
    }

    .tabs button {
        flex: 1;
        padding: 1rem;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .tabs button.active {
        border-bottom-color: #e3350d;
        color: #e3350d;
    }

    .tab-content {
        padding: 1.5rem;
    }

    .info-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }

    .label {
        font-weight: bold;
        color: #555;
    }

    .value {
        color: #333;
    }

    .stat-row {
        margin-bottom: 1rem;
    }

    .stat-name {
        display: block;
        text-transform: capitalize;
        margin-bottom: 0.25rem;
        font-weight: 500;
    }

    .stat-value {
        float: right;
        font-weight: bold;
    }

    .stat-bar {
        height: 8px;
        background-color: #eee;
        border-radius: 4px;
        overflow: hidden;
    }

    .stat-fill {
        height: 100%;
        background-color: #e3350d;
    }

    .moves-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .move-item {
        background-color: #f0f0f0;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
        text-transform: capitalize;
    }

    .more-moves {
        font-style: italic;
        color: #777;
        padding: 0.5rem;
    }
</style>
