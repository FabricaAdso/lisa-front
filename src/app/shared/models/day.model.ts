import { ShiftModel } from "./shift.model";

export interface DayModel {
    id:number;
    name:string;
    number:string;
    shift:ShiftModel
}
