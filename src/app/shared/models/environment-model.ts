import { SedeModel } from "./Sedemodel";

export interface EnvironmentModel{
    id:number;
    name:string;
    capacity:number
    knowledge_network:string;
    headquarters_id:number;
    headquarters?: SedeModel;
   
}