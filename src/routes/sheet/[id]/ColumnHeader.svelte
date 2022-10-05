<script lang="ts">
    import { createEventDispatcher} from 'svelte';
    const dispatcher = createEventDispatcher();

    export let column: number;
    export let active:boolean;
    export let value: string;
    export let element: HTMLElement;
</script>

<div bind:this={element} 
    class="cell"
    style:--column={column}
    class:active={active}
    on:click={(e) => { dispatcher('select')}}
    >
    {value}
</div>

<style>
    .cell{
        position: sticky;
        top: 0;
        background-color: lightgray;
        grid-row:  1;
        grid-column: calc(var(--column) + 2);
        text-align: center;
    }
    .active{
        background-color: gray;
    }

</style>
        