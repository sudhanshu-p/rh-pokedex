<script>
    import { onMount } from "svelte";
    // import { getAllTypes } from "../ex-utils/pokeapi";

    import { filters } from "../utils/store";
    import { getTypeColor } from "../utils/helper";
    import { getAllTypes } from "../utils/pokeService";

    let types = [];
    let selectedTypes = [];
    let isLoading = true;

    function delay() {
        return new Promise((resolve) => setTimeout(resolve, 1000));
    }
    async function getTypesForSure() {
        const response = getAllTypes();

        if (response.error) {
            // Wait
            await delay();
            return getTypesForSure();
        }
        return response.data;
    }

    onMount(async () => {
        try {
            types = await getTypesForSure();
            isLoading = false;
        } catch (error) {
            console.error("Failed to load types:", error);
            isLoading = false;
        }
    });

    function toggleType(type) {
        if (selectedTypes.includes(type)) {
            selectedTypes = selectedTypes.filter((t) => t !== type);
        } else {
            selectedTypes = [...selectedTypes, type];
        }

        // filters.update((f) => ({ ...f, selectedTypes }));
        $filters = { ...$filters, selectedTypes: selectedTypes };
    }

    function clearTypes() {
        selectedTypes = [];
        $filters = { ...$filters, selectedTypes: selectedTypes };
    }
</script>

<div class="type-chips-container">
    <h3>Filter by Type</h3>

    {#if isLoading}
        <p>Loading types...</p>
    {:else}
        <div class="type-chips">
            {#each types as type}
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button
                    class="type-chip icon {type.toLowerCase()}"
                    class:selected={selectedTypes.includes(type)}
                    on:click={() => toggleType(type)}
                >
                    <img
                        src="/{type.toLowerCase()}.svg"
                        alt={type.toLowerCase()}
                    />
                </button>
            {/each}
        </div>

        {#if selectedTypes.length > 0}
            <button class="clear-button" on:click={clearTypes}>
                Clear All
            </button>
        {/if}
    {/if}
</div>

<style>
    .type-chips-container {
        margin-top: 1rem;
    }

    h3 {
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
    }

    .type-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .type-chip {
        border: none;
        cursor: pointer;
        transition: opacity 0.3s ease;
        width: 4rem;
        height: 4rem;
    }

    .type-chip.selected {
        opacity: 1;
        box-shadow:
            0 0 0 2px white,
            0 0 0 4px currentColor;
    }

    .clear-button {
        background: #e3350d;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
    }
</style>
