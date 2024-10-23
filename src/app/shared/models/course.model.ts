import { ProgramModel } from "./program.model";

export interface CourseModel {
    id:number;
    code:number;
    star_date:Date;
    end_date:Date;
    program_id:number;
    program?:ProgramModel
}
