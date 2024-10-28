import { despartamentosModel } from "./Departamentos.model"

export interface municipiosModel{
    id: number,
    name: string,
    departament_id: number
    departament:despartamentosModel    
}