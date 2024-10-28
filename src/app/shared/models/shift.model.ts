import { Time } from "@angular/common";
import { CourseModel } from "./course.model";
import { DayModel } from "./day.model";

export interface ShiftModel {
    id:number;
    name:string;
    start_time:string;
    end_time:string;
    course:CourseModel[]
    day:DayModel[]
}
