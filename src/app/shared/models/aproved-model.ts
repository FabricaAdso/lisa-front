import { EstadoJustificacionEnum } from "@shared/enums/estado-justificacion.enum";
import { JustificationModell } from "./justification-model";

export interface ApprovedModel{
    id: number;
    state?:EstadoJustificacionEnum;
    motive?:string;
    justification_id?:number;
    justification?:JustificationModell;
}