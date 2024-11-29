export interface SessionModel {
  id: number;
  date: string; // Fecha de la sesión
  start_time: string; // Hora de inicio
  end_time: string; // Hora de finalización
  instructor_id?: number | null; // ID del primer instructor (opcional)
  instructor2_id?: number | null; // ID del segundo instructor (opcional)
  course_id?: number | null; // ID del curso (opcional)
  attendanceTaken?: boolean | null; // Asistencia tomada
}
