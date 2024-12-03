import { despartamentosModel } from "./Departamentos.model";
import { municipiosModel } from "./municipios.model";
import { TrainingCenterModel } from "./training-center.model";

export interface SedeModel {
    id: number;
    name: string;
    departament: despartamentosModel;   
    municipality: municipiosModel; 
    adress: string;
    trainingCentre_Id: number;  
    training_center : TrainingCenterModel;


    opening_time:string;
    
    closing_time:string;
  }
