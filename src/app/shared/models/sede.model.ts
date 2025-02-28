import { despartamentosModel } from "./Departamentos.model";
import { municipiosModel } from "./municipios.model";
import { TrainingCenterModel } from "./training-center.model";

export interface SedeModel {
    id: number;
    name: string;
    municipality:string;
    adress: string;
    training_center_id: number;
    training_center: TrainingCenterModel;


    opening_time:string;

    closing_time:string;
  }
