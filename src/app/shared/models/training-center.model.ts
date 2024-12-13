import { RoleModel } from './rolemodel-model';

export interface TrainingCenterModel {
  id: number;
  code: number;
  name: string;
  regional_id: number;
  pivot: TrainingCenterPivotModel;
}

export interface TrainingCenterPivotModel {
  user_id: number;
  training_center_id: number;
  role_id: number;
  role: RoleModel[];
}
