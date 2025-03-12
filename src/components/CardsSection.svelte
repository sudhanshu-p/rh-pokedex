<script>
    import { onMount } from "svelte";

    import Card from "./Card.svelte";
    import PokemonDetailsModal from "./PokemonDetailsModal.svelte";
    import { filters } from "../utils/store";
    import {
        getAllPokemon,
        initializePokemon,
        loadMorePokemon,
        searchPokemon,
    } from "../utils/pokeService";

    // State
    let allPokemon = [];
    let filteredPokemon = [];
    let isLoading = true;
    let error = null;
    let selectedPokemon = null;

    // Constants
    let LIMIT = 20;
    const NEXT = 20;
    let currentPokemon = 20;

    // Initial data fetch
    onMount(async () => {
        await initializePokemon();
        allPokemon = await getAllPokemon();
        filteredPokemon = [...allPokemon];
        isLoading = false;
    });

    // Filter Pokémon based on search term and types
    async function filterPokemon() {
        if (!allPokemon.length) return;

        // Filter by search term
        // $filters.searchTerm
        filteredPokemon = await searchPokemon({
            name: $filters.searchTerm,
            types: $filters.selectedTypes,
        });
    }

    // Handle Pokémon selection
    function handleSelectPokemon(event) {
        selectedPokemon = event.detail;
    }

    // Close details modal
    function closeDetails() {
        selectedPokemon = null;
    }

    async function loadMore() {
        if ($filters.searchTerm || $filters.selectedTypes.length) {
            const newPokemon = await searchPokemon(
                {
                    name: $filters.searchTerm,
                    types: $filters.selectedTypes,
                },
                LIMIT,
                currentPokemon,
            );
            filteredPokemon = filteredPokemon.concat(newPokemon);
            currentPokemon += LIMIT;
        } else {
            const newPokemon = await loadMorePokemon(LIMIT, currentPokemon);
            filteredPokemon = filteredPokemon.concat(newPokemon);
            currentPokemon += LIMIT;
        }
    }

    // Subscribes so that everytime $filters changes, filterPokemon is run.
    $: {
        $filters, filterPokemon();
    }
</script>

{#if isLoading}
    <div class="loading">
        <p>Loading Pokémon...</p>
    </div>
{:else if error}
    <div class="error">
        <p>Error: {error}</p>
        <button on:click={() => window.location.reload()}>Retry</button>
    </div>
{:else}
    <div class="cards-grid">
        {#each filteredPokemon.slice(0, currentPokemon) as pokemon}
            <Card {pokemon} on:select={handleSelectPokemon} />
        {:else}
            <div class="no-results">
                <p>No Pokémon found matching your filters.</p>
            </div>
        {/each}
    </div>
    <!-- <button on:click={loadMore} 
            >Load More</button
        > -->
    <div class="container">
        <button class="button" on:click={loadMore}>
            <span class="button-background"></span>
            <span class="button-text">Load More</span>
        </button>
    </div>
{/if}

{#if selectedPokemon}
    <!-- <PokemonDetails pokemon={selectedPokemon} onClose={closeDetails} /> -->
    <PokemonDetailsModal pokemon={selectedPokemon} onClose={closeDetails} />
{/if}

<style>
    .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.5rem;
    }

    .loading,
    .error,
    .no-results {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .error {
        color: #e3350d;
    }

    .error button {
        background: #e3350d;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
    }

    /* Button styling */

    .container {
        width: 100%;
        height: 10rem; /* h-40 = 10rem */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .button {
        position: relative;
        display: inline-block;
        padding: 0.5rem 0.875rem;
        margin: 0.25rem;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid var(--primary-text);
        color: var(--primary-text);
        border-radius: 0.375rem;
        text-decoration: none;
        background: transparent;
    }

    .button-background {
        position: absolute;
        width: 16rem;
        height: 0;
        background-color: var(--primary-text);
        top: 50%;
        left: 50%;
        transform: translate(-5rem, 0) rotate(45deg);
        transform-origin: center;
        transition: all 0.3s ease;
    }

    .button-text {
        position: relative;
        color: var(--primary-text);
        transition: color 0.3s ease;
    }

    .button:hover .button-background {
        height: 16rem; /* h-64 = 16rem */
        transform: translate(-5rem, -8rem) rotate(45deg);
    }

    .button:hover .button-text {
        color: white;
    }
</style>
