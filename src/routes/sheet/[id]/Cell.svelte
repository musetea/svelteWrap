<script lang="ts">
    import { createEventDispatcher} from 'svelte';
    import type { SheetCell} from './sheet';

    const dispatcher = createEventDispatcher();

    export let row:number;
    export let column: number;
    export let active: boolean;
    export let value: string;
    export let cell:SheetCell;

    enum Mode {
        Editing,
        DisplayValue,
        DisplayFormula
    };
    let mode = Mode.DisplayValue;
    let editValue = cell.formula;
    let displayValue = cell.displayValue;

    //
    const finishEditing = (save:boolean) => {
        mode = Mode.DisplayValue;
        editValue.stopEditing(save);
    };

</script>
<div class="cell"
    style:--row={row}
    style:--column={column}
    class:active={active}
    on:click={(e) => { dispatcher('select')}}
    on:dblclick={() => {
        if(mode === Mode.DisplayValue){
            mode = Mode.Editing;
            editValue.startEditing();
        }else{
            mode = Mode.DisplayValue;
        }    
    }}
    >

    {#if mode === Mode.DisplayValue}
        {$displayValue}
    {:else if mode === Mode.Editing}
        <input type="text" 
            autofocus 
            bind:value={$editValue} 
            on:blur={()=> { finishEditing(true) }} 
            on:keydown={(event) => {
                switch(event.key){
                    case 'Enter': 
                        finishEditing(true);
                        break;
                    case 'Escape':
                        finishEditing(false);
                        break;
                }
            
            }}
        />
    {/if}
</div>



<style>
    .cell{
        border: 1px solid lightgray;
        grid-row:  calc(var(--row) + 2);
        grid-column: calc(var(--column) + 2);
    }

    .cell input[type='text']{
        width: 100%;
        height: calc(100% -2px);  /** border 1px (top + bottom )*/
        outline: none;
        border: none;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .active{
        border-color: red;
        border-width: 1px;
    }

    
</style>
        