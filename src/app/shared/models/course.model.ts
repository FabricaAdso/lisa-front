import { Subject } from "rxjs";
import { ApprenticeModel } from "./apprentice.model";
import { EnvironmentModel } from "./environment-model";
import { ProgramModel } from "./program.model";
import { SubjectModel } from "./subject-model";
import { UserModel } from "./user.model";
import { InstructorModel } from "./instructor.model";

export interface CourseModel {
    id:number;
    code:number | string;
    date_start?:Date;
    date_end?:Date;
    shift:string ;
    state: 'Terminada_por_fecha' | 'En_ejecucion' | 'Terminada' | 'Termindad_por_unificacion';
    stage?: 'PRACTICA' | 'LECTIVA';
    representative_id:number
    representative:ApprenticeModel
    co_representative_id:number
    co_representative:ApprenticeModel

    //relacion con aprendices
    apprentices?:ApprenticeModel

    environment_id?: number;
    environment:EnvironmentModel;
    program_id?:number;
    program?:ProgramModel;
    course_leader_id:number
    course_leader:InstructorModel

}

export interface getSubjectByCourseModel{
    id:number;
    code:number;
    subject?:SubjectModel
}
