import { CourseModel } from "./course.model";

export interface SessionModel {
    id:number;
    name:string;
    start_date:Date;
    end_date:Date
    course_id:number;
    course?:CourseModel;
}
