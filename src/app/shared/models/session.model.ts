import { AssistanceModel } from "./assistance.model";
import { CourseModel } from "./course.model";
import { instructormodel } from "./instructor.model";

export interface SessionModel {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  instructor_id?: number | null;
  instructor?: instructormodel;
  instructor2_id?: number | null;
  course_id?: number | null;
  course?: CourseModel;
  assistances: AssistanceModel[]; 
}

