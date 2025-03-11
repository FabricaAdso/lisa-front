import { HeadquarterModel } from "@shared/models/headquarter.model";
import { KnowledgeNetworkModel } from "@shared/models/knowledg-network.model";
export interface CreateEvironentDTO{
    name:string;
    capacity:number
    knowledge_network_id:number;
    knowledge_network?:KnowledgeNetworkModel;
    headquarters_id:number;
    headquarters?: HeadquarterModel;
}
