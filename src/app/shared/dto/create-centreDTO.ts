import { RegionalModel } from "@shared/models/regional.model";

export interface CreateCentreDTO {
    name: string;
    code: string;
    regional?: RegionalModel;

  }