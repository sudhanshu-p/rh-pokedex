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
    let currentPokemon = 20

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
        const newPokemon = await loadMorePokemon(LIMIT, currentPokemon)
        filteredPokemon = filteredPokemon.concat(newPokemon)
        currentPokemon += LIMIT
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
    <div class="load-more">
        <button on:click={loadMore} 
            >Load More</button
        >
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
    .no-results,
    .load-more {
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
</style>
