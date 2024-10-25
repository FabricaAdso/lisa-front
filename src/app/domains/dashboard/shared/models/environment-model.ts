import { AreaModel } from "./area-model";
import { SedeModel } from "./Sedemodel";

export interface EnvironmentModel{
    id:number;
    name:string;
    capacity:number
    headquarters_id:number;
    headquarters?: SedeModel;
    environment_area_id:number;
    environment_area?:AreaModel;
}