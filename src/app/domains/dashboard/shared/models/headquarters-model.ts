import { TrainingCentreModel } from "./training-centre-model";

export interface HeadquartersModel {
    id: number;
    name: string;
    department: string;   
    municipality: string; 
    address: string;
    trainingCentre_Id: number;  
    trainingCentre : TrainingCentreModel;

    openingHour: string;  
    closingHour: string;  


    
  }