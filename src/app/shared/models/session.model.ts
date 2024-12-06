import { CourseModel } from "./course.model";

export interface SessionModel {
    id:number;
    name:string;
    start_date:Date;
    end_date:Date
    start_time:string;
    end_time:string;
    days_of_week:string;
    course_id:number;
    course?:CourseModel;
}
