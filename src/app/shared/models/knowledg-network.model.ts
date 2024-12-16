import { InstructorModel } from "./instructor.model";

export interface KnowledgeNetworkModel{
    id:number;  
    name:string;
}

export interface KnowledgeNetworkByInstructorModel{
    id:number;  
    name:string;
    instructors?:InstructorModel
}