import { TrainingCentreModel } from "../models/training-centre-model";

export interface CreateHeadquartersDTO {
    name: string;
    department: string;
    municipality: string;
    address: string;
    trainingCentre_Id: number;
    trainingCentreId?:TrainingCentreModel;
    opening_time:string;
    
    closing_time:string;
  }