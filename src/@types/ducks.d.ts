export interface iDispatchDucks{
    addListener(cb:Function): void
    removeListener(id:string): void
}
