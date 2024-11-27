import { TrainingCenterModel } from "../models/training-center.model";

export interface CreateHeadquartersDTO {
    name: string;
    department: string;
    municipality: string;
    address: string;
    trainingCentre_Id: number;
    trainingCentreId?:TrainingCenterModel;
    opening_time:string;
    
    closing_time:string;
  }