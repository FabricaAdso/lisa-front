import { SessionModel } from "./session.model";
import { ApprenticeModel } from "./apprentice.model";
import { JustificationModel } from "./justification-model";

export interface AssistanceModel {

    id: number;
    assistance:boolean;
    session_id?:number;
    session?:SessionModel;
    apprentice?:ApprenticeModel;
    apprentice_id?:number
    justified: JustificationModel[];
}