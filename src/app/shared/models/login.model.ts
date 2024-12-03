import { TrainingCenterModel } from "./training-center.model";

export interface LoginModel {
    identity_document:string;
    password:string;
    training_center_id:number
    trainig_center?:TrainingCenterModel;
}
