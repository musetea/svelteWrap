<script lang="ts">
    import { createEventDispatcher} from 'svelte';
    const dispatcher = createEventDispatcher();

    export let row:number;
    export let active:boolean;
    export let value: string;
    export let element: HTMLElement;
</script>

<div bind:this={element} 
    class="cell"
    style:--row={row}
    class:active={active}
    on:click={(e) => { dispatcher('select')}}
    >
    {value}
</div>

<style>
    .cell{
        position: sticky;
        left: 0;
        background-color: lightgray;
        grid-row:  calc(var(--row) + 2);
        grid-column: 1;
        text-align: center;
    }

    .active{
        background-color: gray;
    }
</style>
        