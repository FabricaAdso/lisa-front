import { CourseModel } from "@shared/models/course.model";

export interface CreateSessionDto {
    id:number;
    name:string;
    start_date:Date;
    end_date:Date;
    course_id:number;
    
}
