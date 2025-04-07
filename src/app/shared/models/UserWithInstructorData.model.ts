// user-with-instructor-data.model.ts
import { UserModel } from "./user.model";
import { InstructorModel } from "./instructor.model";
import { KnowledgeNetworkModel } from "./knowledg-network.model";

export interface UserWithInstructorData {
  user: UserModel;
  is_instructor: boolean;
  instructor_data?: {
    knowledge_network: KnowledgeNetworkModel;
    state: string;
    created_at: string;
  };
}
