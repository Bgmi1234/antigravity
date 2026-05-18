export interface Employee {
  id: number;
  name: string;
  role?: string;
  department?: string;
  productivity?: number;
  status?: string;
  avatar?: string;
  goal?: string;
  tools?: string;
  approval_rules?: string;
  created_at: string;
}

export interface WorkflowStep {
  id: number;
  employee_id: number;
  step_order: number;
  instruction: string;
}
