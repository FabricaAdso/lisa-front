import { UserModel } from "./user.model";

export interface DocumentTypeModel{
    id:number;
    name:string;
    abbreviation:string;
    user?:UserModel;
}