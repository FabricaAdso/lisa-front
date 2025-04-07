// user-with-apprentice-data.model.ts
import { UserModel } from "./user.model";
import { ApprenticeModel } from "./apprentice.model";
import { CourseModel } from "./course.model";

export interface UserWithApprenticeData {
  user: UserModel;
  is_apprentice: boolean;
  apprentice_data?: {
    course: CourseModel;
    state: string;
    created_at: string;
  };
}
