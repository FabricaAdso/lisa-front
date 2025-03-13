import { RegionalModel } from "./regional.model"

export interface tableComponteModel{
    Titles:string[]
    Datos:tableDataComponteModel[]
}
export interface tableDataComponteModel{
    Datos:Array<string>,
    idItem:number,
    regional?: RegionalModel,
   
    acciones:boolean,
}