export function  Singleton(){
    return (target:FunctionConstructor)=>new target()
}
