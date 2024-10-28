import { despartamentosModel } from "./Departamentos.model";
import { municipiosModel } from "./municipios.model";
import { TrainingCentreModel } from "./training-centre-model";

export interface SedeModel {
    id: number;
    name: string;
    departament: despartamentosModel;   
    municipality: municipiosModel; 
    adress: string;
    trainingCentre_Id: number;  
    training_center : TrainingCentreModel;


    opening_time:string;
    
    closing_time:string;
  }
