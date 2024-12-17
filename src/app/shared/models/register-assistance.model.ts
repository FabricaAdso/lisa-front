import { AssistanceModel } from "./assistance.model"

export interface RegisterAssistanceModel {
    key?: string
    assistance?: AssistanceModel[]
    nombre?: string
    apellido?: string
    documento?: string
    correo?: string
}