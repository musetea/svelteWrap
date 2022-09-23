<script lang="ts">
    import { createEventDispatcher} from 'svelte';
    const dispatcher = createEventDispatcher();

    export let row:number;
    export let column: number;

    export let active: boolean;
    export let value: string;
</script>
<div class="cell"
    style:--row={row}
    style:--column={column}
    class:active={active}
    on:click={(e) => { dispatcher('select')}}
    >
    {value}
</div>

<style>
    .cell{
        border: 1px solid lightgray;
        grid-row:  calc(var(--row) + 2);
        grid-column: calc(var(--column) + 2);
    }

    .active{
        border-color: violet;
        border-width: 2px;
    }
</style>
        