import { EducationLevelModel } from "./education-level.model";
import { SubjectModel } from "./subject-model";
import { TrainingCenterModel } from "./training-center.model";

export interface ProgramModel {
    id: number;
    code: string;
    version: string;
    name:string;
    education_level_id:number;
    education_level?:EducationLevelModel;
    training_center_id:number;
    training_center?: TrainingCenterModel;
    subjects?: SubjectModel[];


}
