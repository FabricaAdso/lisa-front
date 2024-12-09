import { SessionModel } from "./session.model";
import { ApprenticeModel } from "./apprentice.model";
import { ApprovedModel } from "./aproved-model";

export interface AssistanceModel {

    id: number;
    assistance: AssistanceModel[];
    session_id?:number;
    session?:SessionModel;
    apprentice?:ApprenticeModel;
    apprentice_id?:number
    aprobation?:ApprovedModel;
}