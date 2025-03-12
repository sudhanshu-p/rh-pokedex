<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { getTypeColor } from "../utils/helper";
    import { getPokemonById } from "../utils/pokeService";
    // import { getpokemon } from "../ex-utils/pokemonService";

    // Props
    let title = "Modal Title";
    let imageUrl = "/api/placeholder/600/800";
    let isOpen = true;
    let tabs = ["About", "Stats", "Moves"];

    // State
    let activeTab = "About";
    let isVertical = false;
    let modalElement;

    // Props
    export let pokemon;
    export let onClose;

    // Check orientation based on window dimensions
    function checkOrientation() {
        if (window.innerHeight > window.innerWidth) {
            isVertical = true;
        } else {
            isVertical = false;
        }
    }

    // Set active tab
    function setActiveTab(tab) {
        activeTab = tab;
    }

    // Format height and weight
    function formatHeight(height) {
        return `${(height / 10).toFixed(1)} m`;
    }

    function formatWeight(weight) {
        return `${(weight / 10).toFixed(1)} kg`;
    }

    // Lifecycle - check orientation when component mounts and on resize
    onMount(async () => {
        checkOrientation();
        window.addEventListener("resize", checkOrientation);
        return () => {
            window.removeEventListener("resize", checkOrientation);
        };
    });
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" on:click={onClose}>
        <div
            class="modal-container {isVertical ? 'vertical' : 'horizontal'}"
            bind:this={modalElement}
            on:click|stopPropagation
            style="background-color: rgba({getTypeColor(
                pokemon.type[0],
            )}, 0.5);"
        >
            <!-- Image and Title Column -->
            <div class="image-column">
                <img src={pokemon.image} alt={title} />
                <h2>
                    {pokemon.name.charAt(0).toUpperCase() +
                        pokemon.name.slice(1)}
                </h2>
            </div>

            <!-- Tabs Column -->
            <div class="tabs-column">
                <div class="tabs-header">
                    {#each tabs as tab}
                        <button
                            class="tab-button {activeTab === tab
                                ? 'active'
                                : ''}"
                            on:click={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    {/each}
                </div>

                <div class="tabs-content">
                    {#if activeTab === "About"}
                        <div class="about-tab">
                            <div class="info-row">
                                <span class="label">Height</span>
                                <span class="value"
                                    >{formatHeight(pokemon.height)}</span
                                >
                            </div>
                            <div class="info-row">
                                <span class="label">Weight</span>
                                <span class="value"
                                    >{formatWeight(pokemon.weight)}</span
                                >
                            </div>
                            <div class="info-row">
                                <span class="label">Abilities</span>
                                <span class="value">
                                    {pokemon.abilities
                                        .map((a) => a.replace("-", " "))
                                        .join(", ")}
                                </span>
                            </div>
                        </div>
                    {:else if activeTab === "Stats"}
                        <div class="stats-tab">
                            {#each pokemon.stat as stat}
                                <div class="stat-row">
                                    <span class="stat-name"
                                        >{stat.name.replace("-", " ")}</span
                                    >
                                    <span class="stat-value">{stat.value}</span>
                                    <div class="stat-bar">
                                        <div
                                            class="stat-fill"
                                            style="width: {Math.min(
                                                100,
                                                (+stat.value / 255) * 100,
                                            )}%"
                                        ></div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else if activeTab === "Moves"}
                        <div class="moves-tab">
                            <div class="moves-list">
                                {#each pokemon.moves.slice(0, 20) as move}
                                    <span class="move-item"
                                        >{move.replace("-", " ")}</span
                                    >
                                {/each}
                                {#if pokemon.moves.length > 20}
                                    <span class="more-moves"
                                        >+ {pokemon.moves.length - 20} more
                                        moves</span
                                    >
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>

                <button class="close-button" on:click={onClose}>×</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }

    .modal-container {
        width: 80%;
        height: 80%;
        display: flex;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(5px) saturate(0%);
        -webkit-backdrop-filter: blur(5px) saturate(0%);
        border: 1px solid rgba(255, 255, 255, 0.18);
        overflow: hidden;
    }

    .horizontal {
        flex-direction: row;
    }

    .vertical {
        flex-direction: column;
    }

    .image-column {
        flex: 1;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .image-column img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        flex-grow: 1;
    }

    .image-column h2 {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
        color: white;
        padding: 20px;
        margin: 0;
        font-size: 1.8rem;
    }

    .tabs-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 20px;
        background-color: white;
        color: black;
    }

    .tabs-header {
        display: flex;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        margin-bottom: 15px;
    }

    .tab-button {
        background: none;
        border: none;
        padding: 10px 15px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .tab-button.active {
        border-bottom: 2px solid black;
    }

    .tabs-content {
        flex-grow: 1;
        overflow-y: auto;
    }

    .tab-panel {
        padding: 10px 0;
        color: white;
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: white;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.3s ease;
    }

    .close-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
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
