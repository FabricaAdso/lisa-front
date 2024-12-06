import { NumberValueAccessor } from "@angular/forms";
import { SessionModel } from "./session.model";

export interface AssistanceModel {

    id: number;
    assistance: boolean;
    session_id?:number;
    session?:SessionModel;
    apprentice_id?:Number;

}