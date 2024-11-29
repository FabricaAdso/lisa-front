import { ApprenticeModel } from "./apprentice.model";
import { SessionModel } from "./session.model";

export interface AssistanceModel{
    id:number;
    assistance:boolean;
    session_id:number;
    session?:SessionModel;
    apprentice_id:number;
    apprentice?:ApprenticeModel
    
}