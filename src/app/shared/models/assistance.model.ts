import { SessionModel } from "./session.model";
import { ApprenticeModel } from "./apprentice.model";
import { JustificationModell } from "./justification-model";

export interface AssistanceModel {

    id: number;
    assistance: AssistanceModel[];
    session_id?:number;
    session?:SessionModel;
    apprentice?:ApprenticeModel;
    apprentice_id?:number
    justified: JustificationModell[];
}