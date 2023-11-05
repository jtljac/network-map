<script>
    import {NetworkComponent} from "$lib/network.js";

    /**
     * The component being accessed on the sidebar
     * @type {NetworkComponent|null}
     */
    export let component = null;

    /**
     * Whether to sidebar is shown
     * @type {boolean}
     */
    export let isActive;

</script>

<div class="sidebar" class:active={isActive}>
    {#if component !== null}
        <input bind:value={component.label}>

    {/if}
</div>

<style>
    .sidebar {
        display: flex;
        flex-direction: column;

        width: 300px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;

        background-color: #F5F5F5;

        border-left: 1px black solid;

        transform: translateX(300px);
        transition: ease 300ms;

        z-index: 10;

        &.active {
            transform: translateX(0);
        }
    }
</style>
