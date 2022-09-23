<script lang="ts">
    import { createEventDispatcher} from 'svelte';
    const dispatcher = createEventDispatcher();

    export let column: number;
    export let active:boolean;
    export let value: string;
</script>
<div class="cell"
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
    }
    .active{
        background-color: gray;
    }

</style>
        