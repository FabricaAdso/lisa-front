import { ApprenticeModel } from "./apprentice.model";
import { EnvironmentModel } from "./environment-model";
import { ProgramModel } from "./program.model";

export interface CourseModel {
    id:number;
    code:number | string;
    date_start?:Date;
    date_end?:Date;
    shift:string ;
    state: 'Terminada_por_fecha' | 'En_ejecucion' | 'Terminada' | 'Termindad_por_unificacion';
    stage?: 'PRACTICA' | 'LECTIVA';

    //relacion con aprendices
    apprentices?:ApprenticeModel

    environment_id?: number;
    environment:EnvironmentModel;
    program_id?:number;
    program?:ProgramModel;
    
}
