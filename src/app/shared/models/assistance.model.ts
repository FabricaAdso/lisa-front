import { NumberValueAccessor } from "@angular/forms";
import { SessionModel } from "./session.model";
import { ApprenticeModel } from "./apprentice.model";

export interface AssistanceModel {

    id: number;
    assistance: boolean;
    session_id?:number;
    session?:SessionModel;
    apprentice?:ApprenticeModel;
}