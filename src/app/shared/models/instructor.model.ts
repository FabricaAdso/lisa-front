import { UserModel } from "./user.model";

export interface instructormodel{
    state: string;
    user_id:number;
    training_center_id: number;
    user?:UserModel;
}
