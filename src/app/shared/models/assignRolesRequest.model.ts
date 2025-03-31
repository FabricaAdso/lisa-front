interface AssignRolesRequest {
  user_id: string;
  role_ids: number[];
  course_id?: number | null;
  state?: string | null;
  knowledge_network_id?: number | null;
}
