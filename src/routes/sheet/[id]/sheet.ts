import { writable, type Writable, get, derived } from 'svelte/store';

export interface SheetCell{
    row:number,
    column:number,
    displayValue:Writable<string>,
    formula:Writable<string> & {
        startEdting: () => void,
        stopEdting: (save:boolean) => void,
    },
};


export function createSheet({numOfRows, numOfColumns}: {numOfRows:number, numOfColumns:number}){
    // TODO
    const sheet = new Map();
    for(let r=0; r<numOfRows; r++){
        for(let c=0; c<numOfColumns; c++){
            const columnName = getColumnName(c);
            const rowIndex = getRowIndex(r);
            const cell = createSheetCell({row:c, column:c, sheet});
            sheet.set(columnName+rowIndex, cell);
        }
    }

    return sheet;
};

function createSheetCell({row, column, sheet}: {row:number, column:number, sheet:Map<string, SheetCell>}){
    const displayValue = writable('');
    let formulaValue = ''
    let lastSavedFormulaValue:string;
    let cleanup: () => void;
    const formula = writable(formulaValue);


    return {
        row,
        column,
        displayValue,
        formula:{
            set: (value:string) =>{
                formulaValue = value;
                formula.set(value);
            },
            subscribe: formula.subscribe,
            startEditing(){
                console.log(`start editing cell ${row},${column}`);
                lastSavedFormulaValue = formulaValue;
            },
            stopEditing(save:boolean){
                console.log(`stop editing cell ${row},${column}`);
                if(save){
                    if(formulaValue.startsWith('=')){
                        // TODO
                        if(typeof cleanup === 'function'){
                            cleanup();
                        }
                        const derivedStore = createDerivedDisplayValueStore(formulaValue, sheet);
                        cleanup = derivedStore.subscribe((newDisplayValue) =>{
                            console.log(newDisplayValue);
                            displayValue.set(newDisplayValue);
                        });    
                    }else{
                        displayValue.set(formulaValue);
                    }
                }
                else{
                    formula.set(lastSavedFormulaValue);
                }
            },
        },
    }
};  

export function getColumnName(column:number){
    return String.fromCharCode('A'.charCodeAt(0) + column);
};

export function getRowIndex(row:number){
    return row + 1;
};

function createDerivedDisplayValueStore(formulaValue:string, sheet:Map<string, SheetCell>){
    // TODO
    const obj = new Proxy({}, {
        has(_, key){
            return true;
        },
        get(_, propertyName){
            if(propertyName === Symbol.unscopables) return [];
            const displayValue = sheet.get(propertyName as string).displayValue;
            if(detecting){
                storesToSubscribe.push(displayValue);
            }
            return get(displayValue);
        }
    });
    const fn = new Function('sheet', `with(sheet) { ${formulaValue.replace('=', 'return ')} }`);
    let storesToSubscribe = [];
    let detecting = true;
    fn(obj);
    detecting = false;
    console.log(storesToSubscribe);

    const derivedStore = derived(storesToSubscribe, () => {
        return fn(obj);
    });
    return derivedStore;
};