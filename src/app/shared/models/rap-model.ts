import { SubjectModel } from "./subject-model";

export interface RapModel {

  description:string;
  number_hours:number;
  subject?: SubjectModel;
}
