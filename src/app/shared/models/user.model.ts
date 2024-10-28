import { DocumentTypeModel } from "./document-type.model";

export interface UserModel{
     id:number;
     first_name:string;
     middle_name:string;
     last_name:string;
     second_last_name:string;
     identity_document:string;
     email:string;
     document_type_id:number;
     document_type?:DocumentTypeModel;
}