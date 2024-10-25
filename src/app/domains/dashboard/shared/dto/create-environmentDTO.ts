import { AreaModel } from "../models/area-model";
import { SedeModel } from "../models/Sedemodel"
export interface CreateEvironentDTO{
    name:string;
    capacity:number
    
    environment_area_id:number;
    environment_area?:AreaModel;

    headquarters_id:number;
    headquarters?: SedeModel;
}