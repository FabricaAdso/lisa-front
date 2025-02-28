import { AreaModel } from "./area-model";
import { KnowledgeNetworkModel } from "./knowledg-network.model";
import { SedeModel } from "./sede.model";

export interface EnvironmentModel{
    id:number;
    name:string;
    capacity:number
    knowledge_network_id:number;
    knowledge_network:KnowledgeNetworkModel;
    headquarters_id:number;
    headquarters?: SedeModel;

}
