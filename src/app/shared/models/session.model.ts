import { CourseModel } from "./course.model";

export interface SessionModel {
    id:number;
    name:string;
    start_date:Date;
    end_date:Date
    start_time:Date;
    end_time:Date;
    days_of_week:string;
    course_id:number;
    course?:CourseModel;
}
