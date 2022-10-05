<script lang="ts">
    import { tick } from 'svelte';
    import RowHeader from './RowHeader.svelte';
    import ColumnHeader from './ColumnHeader.svelte';
    import Cell from './Cell.svelte';
    import {getColumnName, getRowIndex, createSheet} from './sheet';
    //import {scrollIntoView } from '../../../actions/scroll';
    import type { ActiveCell} from '../../../lib/interface';

    const rowHeaders:HTMLElement[] = [];
    const columnHeaders:HTMLElement[] = [];

    let numOfColumns = 26;
    let numOfRows = 50;
    const sheet = createSheet({numOfRows:numOfRows, numOfColumns:numOfColumns} );

    //style:grid-template-columns="{`repeat(${numOfColumns},60px)`}"
    //style:grid-template-rows="{`repeat(${numOfColumns}, 20px)`}" 
    //style:grid-template-columns="repeat({numOfColumns},60px)"
    //style:grid-template-rows="repeat({numOfColumns}, 20px)"


    let activeCell: ActiveCell = {
        column: 0,
        row: 0
    };

    const onSelect = (column:number, row:number) =>{
        activeCell = {
            column, 
            row
        }
    };

    const keyDownToDelta  = {
        ArrowUp:    {   rowDirection:-1},
        ArrowDown:  {   rowDirection:1},
        ArrowLeft:  {   columnDirection:-1},
        ArrowRight: {   columnDirection:1}
    } as const;

    
    /***/
    const onKeyDown = (event:KeyboardEvent) => {
        console.log(event.key);
        const key = event.key;
        switch(key){
            case 'ArrowUp': 
            case 'ArrowDown': 
            case 'ArrowLeft': 
            case 'ArrowRight': 
                //moveActiveCell(keyDownToDelta[event.key as keyof typeof keyDownToDelta]);  
                const controlPressed = event.metaKey || event.ctrlKey;
                moveActiveCell(keyDownToDelta[key], { allTheWay : controlPressed});  
                event.preventDefault();
                break;
                // moveActiveCell(event, { rowDelta: 1});  
                // break;
                // moveActiveCell(event, { columnDelta: -1});  
                // break; 
                // moveActiveCell(event, { columnDelta: 1});  
                // break;
        }
    };

    function moveActiveCell({ rowDirection=0, columnDirection=0}, { allTheWay} : {allTheWay:boolean}){

        if(allTheWay){
            // activeCell.row = rowDirection === -1 ? 0 : rowDirection === 1 ?   numOfRows -1 : activeCell.row;
            if(rowDirection === -1){
                activeCell.row = 0;
            }else if(rowDirection === 1){
                activeCell.row = numOfRows -1;
            }
            activeCell.column = columnDirection === -1 ? 0 : columnDirection === 1 ? numOfColumns -1 : activeCell.column;
        }else{
            activeCell.row = Math.max(Math.min(activeCell.row + rowDirection, numOfRows-1), 0);
            // activeCell.row += rowDelta;
            // activeCell.column += columnDelta;
            activeCell.column = Math.max(Math.min(activeCell.column + columnDirection, numOfColumns-1), 0);
        }



    };

    function actionScrollIntoView(container:HTMLElement, activeCell:ActiveCell){
        function scrollIntoView(activeCell:ActiveCell){
            console.log(container, activeCell);
            //console.log(rowHeaders,columnHeaders);

            let activeCellLeft = rowHeaders[0].getBoundingClientRect().width;
            let activeCellTop = columnHeaders[0].getBoundingClientRect().height;
            let activeCellWidth = columnHeaders[activeCell.column].getBoundingClientRect().width;  
            let activeCellHeight= rowHeaders[activeCell.row].getBoundingClientRect().height;
            // console.log({
            //     left:activeCellLeft,
            //     top:activeCellTop,
            //     width:activeCellWidth,
            //     height:activeCellHeight
            // });
            // console.log(columnHeaders.length, activeCellLeft);
            for(let i=0; i < activeCell.column; i++){
                const column = columnHeaders[i];
                // console.log(column);
                activeCellLeft += column.getBoundingClientRect().width;
            }
            for(let i=0; i < activeCell.row; i++){
                activeCellTop += rowHeaders[i].getBoundingClientRect().height;
            }
            console.log(activeCellLeft, activeCellTop);

            // 마진
            const margin = {
                left:rowHeaders[0].getBoundingClientRect().width +15,
                right: 15,
                top:columnHeaders[0].getBoundingClientRect().height + 15,
                bottom:15
            };

            let newScrollX = container.scrollLeft, 
                newScrollY = container.scrollTop;

            // 왼쪽모서리
            console.log("left", activeCellLeft," < " , (container.scrollLeft + margin.left)); 
            if(activeCellLeft < container.scrollLeft + margin.left){
                newScrollX = activeCellLeft - margin.left;
            }
            console.log("right", activeCellLeft + activeCellWidth," > " , (container.scrollLeft + container.clientWidth)); 
            if(activeCellLeft + activeCellWidth > container.scrollLeft + container.clientWidth){
                console.log("right");
                newScrollX =  activeCellLeft + activeCellWidth + margin.right - container.clientWidth;
            }
            // TOP
            if(activeCellTop < container.scrollTop + margin.top){
                newScrollY = activeCellTop - margin.top;
            }

            // bottom 
            if(activeCellTop + activeCellHeight > container.scrollTop + container.clientHeight){
                newScrollY =  activeCellTop + activeCellHeight + margin.bottom - container.clientHeight;
            }
            
            console.log({
                scrollTop:  container.scrollTop,
                scrollLeft:  container.scrollLeft,
                scrollWidth: container.scrollWidth,
                scrollHeight: container.scrollHeight,
                height: container.clientHeight,
                width: container.clientWidth
            });
            //container.scrollTo({ left:newScrollX, top:newScrollY});
            console.log({left:newScrollX, top:newScrollY});
            container.scrollBy({ left:newScrollX, top:newScrollY, behavior: 'smooth'});
            
        }
        waitForBindingForColumnHeadersToFinish().then(()=>scrollIntoView(activeCell));
        return{
            update: scrollIntoView,
            destroy: () => {}, 
        }
    };

    function waitForBindingForColumnHeadersToFinish(){
        return tick();
    };

</script>

<svelte:body on:keydown={onKeyDown}></svelte:body>


<!--  -->
<main
    use:actionScrollIntoView={activeCell}
    class=""
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
                    on:select={ ()=>{ 
                        activeCell = {column, row}}
                    }
                    value={`${colName}-${rowIndex}`}
                />
            {/each}
        {/each}

        <!--  -->
        {#each { length:numOfColumns} as _, column }
            {@const colName = String.fromCharCode('A'.charCodeAt(0) + column)}
            <ColumnHeader 
                bind:element={columnHeaders[column]}
                active={activeCell?.column === column} 
                {column} 
                value={colName} 
                />
        {/each}

        <!--  -->
        {#each { length:numOfRows} as _, row }
            {@const rowIndex = row + 1}
            <RowHeader 
                bind:element={rowHeaders[row]}
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
        grid-template-rows: repeat(calc(var(--rows) + 1 ), 20px);
        grid-template-columns: repeat(calc(var(--columns) + 1 ), minmax(50px,1fr));
    }
</style>
        