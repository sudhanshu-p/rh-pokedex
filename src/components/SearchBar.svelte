<script>
    import { filters } from "../utils/store";

    let searchInput = "";

    const updateSearch = (value) => {
        // filters.update((f) => ({ ...f, searchTerm: value }));
        $filters = { ...$filters, searchTerm: value };
        searchInput = value;
    };
</script>

<div class="search-container">
    <input
        type="text"
        placeholder="Search Pokémon by name"
        bind:value={searchInput}
        on:input={(e) => updateSearch(e.target.value)}
    />
    {#if searchInput}
        <button class="clear-button" on:click={() => updateSearch("")}>✕</button
        >
    {/if}
</div>

<style>
    .search-container {
        position: relative;
        margin-bottom: 1rem;
    }

    input {
        width: 100%;
        padding: 10px 30px 10px 10px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    input:focus {
        outline: none;
        border-color: #e3350d;
    }

    .clear-button {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #777;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .clear-button:hover {
        color: #e3350d;
    }
</style>
