import { ProgramModel } from "./program.model";
import { RapModel } from "./rap-model";

export interface SubjectModel{
    id: number;
    name: string;
    total_number_hours: number;
    program_id: number;
    program?:ProgramModel

    //relacion con raps
    rap?:RapModel;
}
