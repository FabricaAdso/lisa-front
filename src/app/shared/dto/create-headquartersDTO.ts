import { TrainingCenterModel } from "../models/training-center.model";

export interface CreateHeadquartersDTO {
    name: string;
    municipality: string;
    adress: string;
    training_center_id?: number;
    training_center?:TrainingCenterModel;
    opening_time:string;

    closing_time:string;
  }
