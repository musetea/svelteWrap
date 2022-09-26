<script lang="ts">
    import RowHeader from './RowHeader.svelte';
    import ColumnHeader from './ColumnHeader.svelte';
    import Cell from './Cell.svelte';
    import {getColumnName, getRowIndex, createSheet} from './sheet';

    let numOfColumns = 10;
    let numOfRows = 10;
    const sheet = createSheet({numOfRows:numOfRows, numOfColumns:numOfColumns} );

    //style:grid-template-columns="{`repeat(${numOfColumns},60px)`}"
    //style:grid-template-rows="{`repeat(${numOfColumns}, 20px)`}" 
    //style:grid-template-columns="repeat({numOfColumns},60px)"
    // style:grid-template-rows="repeat({numOfColumns}, 20px)"

    let activeCell: { column: number, row: number} | null = {
        column: 0,
        row: 0
    };
</script>

<main class=""
    style:--rows="{numOfRows}"
    style:--columns="{numOfColumns}"
    >
    <div class="container">
        {#each { length:numOfColumns} as _, column }
            {@const colName = getColumnName(column)}
            {#each { length:numOfRows} as _, row }
            {@const rowIndex =getRowIndex(row) }
            {@const cellName = colName + rowIndex}
                <Cell
                    cell={sheet.get(cellName)}
                    {row}
                    {column}
                    active={activeCell?.column === column && activeCell?.row === row} 
                    on:select={()=>{activeCell = {column, row}}}
                    value={`${colName}-${rowIndex}`}
                />
            {/each}
        {/each}

        <!--  -->
        {#each { length:numOfColumns} as _, column }
            {@const colName = String.fromCharCode('A'.charCodeAt(0) + column)}
            <ColumnHeader 
                active={activeCell?.column === column} 
                {column} 
                value={colName} 
                />
        {/each}

        <!--  -->
        {#each { length:numOfRows} as _, row }
            {@const rowIndex = row + 1}
            <RowHeader 
                active={activeCell?.row === row}     
                {row} 
                value={String(rowIndex)} 
            />
        {/each}
    </div>
</main>


<style>
    main{

        /* grid-area: sheet; */
        overflow: auto;
    }

    .container{
        display: grid;
        grid-template-columns: repeat(calc(var(--columns)+1), minmax(100px,1fr));
        grid-template-rows: repeat(calc(var(--rows)+1), 20px);
    }
</style>
        