import { CreateSessionDto } from "./create-session-dto";

export interface UpdateSessionDto extends CreateSessionDto{
  id: number;

}

export interface sessionupdatepartialDto {
  id: number;
  date: string;        // La fecha en formato "YYYY-MM-DD"
  start_time: string;  // La hora de inicio en formato "HH:mm:ss"
  end_time: string;    // La hora de fin en formato "HH:mm:ss"
  instructor?: number;
}
