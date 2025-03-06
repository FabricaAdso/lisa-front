import { TrainingCenterModel } from "./training-center.model";

export interface HeadquarterModel {
    id: number;
    name: string;
    municipality:string;
    adress: string;
    training_center_id?: number;
    training_center?: TrainingCenterModel;


    opening_time:string;

    closing_time:string;
  }
