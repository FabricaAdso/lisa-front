import { SessionModel } from "./session.model";
import { ApprenticeModel } from "./apprentice.model";
import { JustificationModel } from "./justificationModel";

export interface AssistanceModel {

    id: number;
    assistance: AssistanceModel[];
    session_id?:number;
    session?:SessionModel;
    apprentice?:ApprenticeModel;
    apprentice_id?:number
    justified: JustificationModel[];
}