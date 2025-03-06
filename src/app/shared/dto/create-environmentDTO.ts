import { HeadquarterModel } from "@shared/models/headquarter.model";
import { AreaModel } from "../models/area-model";
export interface CreateEvironentDTO{
    name:string;
    capacity:number
    
    environment_area_id:number;
    environment_area?:AreaModel;

    headquarters_id:number;
    headquarters?: HeadquarterModel;
}