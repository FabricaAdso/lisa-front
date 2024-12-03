export interface CreateUserDTO {
     first_name:string;
     middle_name:string;
     last_name?:string;
     second_last_name?:string;
     identity_document:string;
     email:string;
     password:string;
     password_confirmation:string;
     document_type_id?:number;
     training_center_id?:number;
}