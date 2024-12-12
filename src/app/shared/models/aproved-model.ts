import { EstadoJustificacionEnum } from "@shared/enums/estado-justificacion.enum";
import { JustificationModel } from "./justification-model";

export interface ApprovedModel{
    id: number;
    state?:EstadoJustificacionEnum;
    motive?:string;
    justification_id?:number;
    justification?:JustificationModel;
}