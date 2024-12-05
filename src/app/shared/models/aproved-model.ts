import { JustificationModell } from "./justification-model";

export interface ApprovedModel{
    id: number;
    state?: 'Pendiete'|'Aprobada'|'Rechazada'|'Vencida'
    motive?:string;
    justification_id?:number;
    justification?:JustificationModell;
}