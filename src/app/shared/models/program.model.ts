import { EducationLevelModel } from "./education-level.model";

export interface ProgramModel {
    id: number;
    name:string;
    education_level_id:string;
    education_level?:EducationLevelModel
}
