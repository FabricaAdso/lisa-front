import { ProgramModel } from "@shared/models/program.model";
import { ShiftModel } from "@shared/models/shift.model";

export interface CreateCourseDto {
    code:number;
    date_start:Date;
    date_end:Date;
    program_id:number;
    shift:ShiftModel


}
