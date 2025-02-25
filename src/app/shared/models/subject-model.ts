import { RapModel } from "./rap-model";

export interface SubjectModel {

  description:string;
  number_hours:number;

  rap:RapModel[];
}
