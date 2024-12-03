export interface JustificationModel {
  id: number; // ID único de la justificación
  fileName: string; // Nombre del archivo cargado (ejemplo: "justificacion.pdf")
  reason: string; // Razón o descripción de la justificación
  status: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Vencida'; // Estado de la justificación
  date: string; // Fecha de la inasistencia
}