from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# WorkflowStep Schemas
class WorkflowStepBase(BaseModel):
    step_order: int
    instruction: str

class WorkflowStepCreate(WorkflowStepBase):
    pass

class WorkflowStepResponse(WorkflowStepBase):
    id: int
    employee_id: int

    class Config:
        from_attributes = True

# Employee Schemas
class EmployeeBase(BaseModel):
    name: str
    role: Optional[str] = None
    department: Optional[str] = "Engineering"
    productivity: Optional[int] = 0
    status: Optional[str] = "Active"
    avatar: Optional[str] = None
    goal: Optional[str] = None
    tools: Optional[str] = None
    approval_rules: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    steps: List[WorkflowStepResponse] = []

    class Config:
        from_attributes = True

# ExecutionLog Schemas
class ExecutionLogBase(BaseModel):
    step_number: int
    input: str
    output: Optional[str] = None
    status: str

class ExecutionLogCreate(ExecutionLogBase):
    pass

class ExecutionLogResponse(ExecutionLogBase):
    id: int
    execution_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Execution Schemas
class ExecutionBase(BaseModel):
    user_input: str
    status: str

class ExecutionCreate(ExecutionBase):
    employee_id: int

class ExecutionResponse(ExecutionBase):
    id: int
    employee_id: int
    final_output: Optional[str] = None
    created_at: datetime
    logs: List[ExecutionLogResponse] = []

    class Config:
        from_attributes = True
