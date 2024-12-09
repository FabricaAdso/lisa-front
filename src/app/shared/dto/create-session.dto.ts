import { CourseModel } from "@shared/models/course.model";
import { InstructorModel } from "@shared/models/instructor.model";

export interface CreateSessionDTO{
    start_date:Date;
    end_date:Date
    start_time:Date;
    end_time:Date;
    instructor_id:number;
    instructor?:InstructorModel
    course_id:number;
    course?:CourseModel;
}