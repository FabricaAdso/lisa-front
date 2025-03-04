import { DocumentTypeModel } from "./document-type.model";
import { RoleModel } from "./rolemodel-model";
import { TrainingCenterModel } from "./training-center.model";

export interface UserModel{
     id:number;
     name:string;
     last_name:string;
     identity_document:string;
     email:string;
     document_type_id:number;
     document_type?:DocumentTypeModel;
     training_centers: TrainingCenterModel[];
     roles: string[];
}
