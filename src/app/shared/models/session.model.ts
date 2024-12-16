import { AssistanceModel } from "./assistance.model";
import { CourseModel } from "./course.model";
import { InstructorModel } from "./instructor.model";

export interface SessionModel {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  instructor_id?: number | null;
  instructor?: InstructorModel;
  instructor2_id?: number | null;
  course_id?: number | null;
  course?: CourseModel;
  assistances: AssistanceModel[]; 

  //relaciones
  assistance:AssistanceModel
}

