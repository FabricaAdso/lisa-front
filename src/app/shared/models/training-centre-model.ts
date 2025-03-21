import { RegionalModel } from "./regional.model";

export interface TrainingCentreModel {
    id: number;
    code: string;
    name: string;
    regional_id?: number;
    regional?: RegionalModel;
}
