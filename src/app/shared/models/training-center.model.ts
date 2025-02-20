import { RoleModel } from './rolemodel-model';

export interface TrainingCenterModel {
  id: number;
  code: number;
  name: string;
  role_id:number,
  regional_id: number;
  pivot: TrainingCenterPivotModel;
}

export interface TrainingCenterPivotModel {
  user_id: number;
  training_center_id: number;
  role_id: number;
  role: RoleModel[];
}
