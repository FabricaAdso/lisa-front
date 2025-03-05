import { RapModel } from "./rap-model";

export interface SubjectModel {
  id:number;
  name:string;
  total_number_hours:number;

  raps:RapModel[];
}

export interface RapbysubjectModel{
    id:number;
    name:string;
    rap?:RapModel
}

