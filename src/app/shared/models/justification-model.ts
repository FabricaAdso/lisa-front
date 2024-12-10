import { ApprovedModel } from "./aproved-model";
import { AssistanceModel } from "./assistance.model";

export interface JustificationModel{
    id: number;
    file_url?:string;
    description?:string;
    assistance_id?:number;
    assistance?: AssistanceModel;
    aprobation?: ApprovedModel; // Relación con la tabla aprobations 
    state:string;
}

