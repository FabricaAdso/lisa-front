import { HeadquarterModel } from "./headquarter.model";
import { KnowledgeNetworkModel } from "./knowledg-network.model";


export interface EnvironmentModel{
    id:number;
    name:string;
    capacity:number
    knowledge_network_id:number;
    knowledge_network:KnowledgeNetworkModel;
    headquarters_id:number;
    headquarters: HeadquarterModel;

}
