import { EducationLevelModel } from "./education-level.model";

export interface ProgramModel {
    id: number;
    name:string;
    education_level_id:number;
    education_level?:EducationLevelModel
}
export interface TableModel{
    titulo:string[],
    dato:datosTable[],
}
export interface datosTable{
    id:number;
    dato:Array<string>
    delete:boolean;
    
}