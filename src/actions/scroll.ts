import { tick } from 'svelte';
import type { ActiveCell} from '../lib/interface';

export function scrollIntoView(container:HTMLElement, params = {}){
    
    function _scrollIntoView(params){
        const { activeCell, rowHeaders, columnHeaders } = params;
        console.log(activeCell,rowHeaders,columnHeaders
        )
        let activeCellLeft = rowHeaders[0].getBoundingClientRect().width, 
            activeCellTop = columnHeaders[0].getBoundingClientRect().height;
        let activeCellWidth = columnHeaders[activeCell.column].getBoundingClientRect().width;  
        let activeCellHeight= rowHeaders[activeCell.row].getBoundingClientRect().height;

        for(let i=0; activeCell.column; i++){
            activeCellLeft += columnHeaders[i].getBoundingClientRect().width;
        }
        for(let i=0; activeCell.row; i++){
            activeCellTop += rowHeaders[i].getBoundingClientRect().height;
        }
        console.log(
            activeCellLeft,
            activeCellTop,
            activeCellWidth,
            activeCellHeight
        )
        console.log(container, activeCell);
        console.log({
            scrollTop:  container.scrollTop,
            scrollLeft:  container.scrollLeft,
            scrollWidth: container.scrollWidth,
            scrollHeight: container.scrollHeight,
            height: container.clientHeight,
            width: container.clientWidth
        })
        
    };
    // action runs before binding
    // have to make some delay
    waitForBindingForColumnHeadersToFinish().then(()=> _scrollIntoView(params));

    function waitForBindingForColumnHeadersToFinish(){
        return tick();
    };
    
    return{
        update: _scrollIntoView,
        destroy(){},
    }
};