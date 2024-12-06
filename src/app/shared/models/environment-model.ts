import { AreaModel } from "./area-model";
import { SedeModel } from "./sede.model";

export interface EnvironmentModel{
    id:number;
    name:string;
    capacity:number
    knowledge_network:string;
    headquarters_id:number;
    headquarters?: SedeModel;
   
}