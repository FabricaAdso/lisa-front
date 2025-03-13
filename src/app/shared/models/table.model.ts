export interface tableComponteModel{
    Titles:string[]
    Datos:tableDataComponteModel[]
}
export interface tableDataComponteModel{
    Datos:Array<string>,
    idItem:number,
    acciones:boolean,
}