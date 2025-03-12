<script>
    import { slide } from "svelte/transition";
    import TypeChips from "./TypeChips.svelte";

    let isOpen = false;

    function toggleFilters() {
        isOpen = !isOpen;
    }
</script>

<div class="advanced-filters">
    <button class="toggle-button" on:click={toggleFilters}>
        {isOpen ? "Hide Advanced Filters" : "Show Advanced Filters"}
        <span class="up-down-icon">{isOpen ? "▲" : "▼"}</span>
    </button>

    {#if isOpen}
        <div class="filters-content" transition:slide={{ duration: 300 }}>
            <TypeChips />
        </div>
    {/if}
</div>

<style>
    .advanced-filters {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
        overflow: hidden;
    }

    .toggle-button {
        width: 100%;
        padding: 1rem;
        background: #e3350d;
        color: white;
        border: none;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .up-down-icon {
        font-size: 0.8rem;
    }

    .filters-content {
        background-color: var(--secondary-background);
        padding: 1rem;
    }
</style>
