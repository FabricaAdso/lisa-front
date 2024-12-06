export interface ApprenticeModel{
    id:number;
    state:'formacion'|'Desertado'|'Etapa_productiva'|'Retiro_voluntario'

    user_id?:number;
    course_id?:number;
}