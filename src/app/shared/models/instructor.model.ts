import { KnowledgeNetworkModel } from "./knowledg-network.model";
import { TrainingCenterModel } from "./training-center.model";
import { UserModel } from "./user.model";

export interface InstructorModel{
    id:number;
    state:StateInstructor;
    user_id:number
    user?:UserModel;
    training_center_id:number;
    training_center?:TrainingCenterModel;
    knowledge_network_id:number;
    knowledge_network?:KnowledgeNetworkModel


}

export enum StateInstructor {
    Activo = 'Activo',
    Inactivo = 'Inactivo'

}
