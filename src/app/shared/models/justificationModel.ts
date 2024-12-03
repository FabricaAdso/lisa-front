export interface JustificationModel {
  id: number;
  fileName: string;
  reason: string;
  state: string; // Cambia aquí de status a state
  date: string;
  session: string;
  instructor: string;
  shift: string;
}