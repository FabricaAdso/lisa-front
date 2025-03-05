import { SubjectModel } from "./subject-model";

export interface RapModel {
  id:number;
  description:string;
  number_hours:number;
  subject?: SubjectModel;
}
