export interface HeadquartersModel {
    id: number;
    name: string;
    department: string;   // Ejemplo: Cauca
    municipality: string; // Ciudad dentro del departamento
    address: string;
    trainingCentre_Id: number;  // Referencia al centro de formación
    openingHour: string;  // Hora de apertura (en formato HH:mm)
    closingHour: string;  // Hora de cierre (en formato HH:mm)
  }