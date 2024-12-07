import { AssistanceModel } from "./assistance.model";

export interface JustificationModell{
    id: number;
    file_url?:string;
    description?:string;
    assistance_id?:number;
    assistance?: AssistanceModel;
}