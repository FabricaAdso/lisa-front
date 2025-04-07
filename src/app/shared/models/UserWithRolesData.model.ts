// user-with-roles.model.ts
export interface UserWithRolesData {
  user: {
    id: number;
    identity_document: string;
    name: string;
    last_name: string;
    email: string;
    document_type: {
      id: number;
      name: string;
      abbreviation: string;
    };
    roles: string[];
    training_centers: {
      id: number;
      name: string;
      pivot: {
        role_id: number;
      };
    }[];
  };
  is_apprentice?: boolean;
  is_instructor?: boolean;
  apprentice_data?: {
    course_id: number;
    state: string;
    course: {
      id: number;
      code: string;
      program: {
        training_center: {
          id: number;
          name: string;
        };
      };
    };
  };
  instructor_data?: {
    knowledge_network_id?: number;
    state: string;
    knowledge_network?: {
      id: number;
      name: string;
    };
  };
}
