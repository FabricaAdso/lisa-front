import { CourseModel } from "./course.model";
import { UserModel } from "./user.model";

export interface ApprenticeModel{
    id:number;
    state:StateApprentice
    user_id:number;
    user?:UserModel;
    course_id:number;
    course?:CourseModel
}

export enum StateApprentice {
    Formacion = 'Formacion',
    Desertado = 'Desertado',
    Etapa_productiva = 'Etapa_productiva',
    Retiro_voluntario = 'Retiro_voluntario'

}

