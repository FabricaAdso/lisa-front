import { SubjectModel } from "./subject-model";

export interface RapModel{
    id: number,
    description: string,
    subject_id: number,
    subject?:SubjectModel;
    number_hours: number,
}
