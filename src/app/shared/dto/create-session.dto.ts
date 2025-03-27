import { CourseModel } from "@shared/models/course.model";
import { InstructorModel } from "@shared/models/instructor.model";
import { RapModel } from "@shared/models/rap-model";

export interface CreateSessionDTO{
    days_of_week:string;
    start_date:string;
    start_time:string;
    end_time:string;
    instructor_id:number;
    instructor?:InstructorModel
    course_id:number;
    course?:CourseModel;
    rap:RapModel;
}
