from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..services import ollama_service

router = APIRouter()

class TaskPlanRequest(BaseModel):
    user_prompt: str

class EmployeeStatus(BaseModel):
    id: str
    role: str
    status: str
    current_task: str
    progress: int

class TaskPlanResponse(BaseModel):
    task_id: int
    task_summary: str
    employees_needed: List[EmployeeStatus]
    workflow_plan: List[str]
    employee_count: int
    charge_required: bool
    estimated_price: int

# In-memory store for mock tasks
tasks_db = {}
task_id_counter = 1

@router.post("/plan", response_model=TaskPlanResponse)
def plan_task(req: TaskPlanRequest):
    global task_id_counter
    
    # Try Ollama (if fails use mock)
    task_summary = "AI Campaign Strategy"
    try:
        # Prompt Ollama to extract a brief title/summary
        prompt = f"Summarize this task request in 4 words or less: '{req.user_prompt}'. Output only the summary, no markdown, no quotes."
        response = ollama_service.generate_response(prompt)
        if response and len(response) > 0:
            task_summary = response.strip()
    except Exception:
        pass # fallback to mock summary
        
    tid = task_id_counter
    task_id_counter += 1
    
    mock_plan = TaskPlanResponse(
        task_id=tid,
        task_summary=task_summary,
        employees_needed=[
            EmployeeStatus(id="manager", role="Manager", status="planning", current_task="Analyzing user task", progress=0),
            EmployeeStatus(id="researcher", role="Researcher", status="waiting", current_task="Pending instructions", progress=0),
            EmployeeStatus(id="writer", role="Writer", status="waiting", current_task="Pending instructions", progress=0),
            EmployeeStatus(id="designer", role="Designer", status="waiting", current_task="Pending instructions", progress=0),
            EmployeeStatus(id="reviewer", role="Reviewer", status="waiting", current_task="Pending instructions", progress=0)
        ],
        workflow_plan=[
            "Manager analyzes the prompt and splits it into sub-tasks.",
            "Researcher gathers market data and trends.",
            "Writer drafts the campaign copy.",
            "Designer generates visual assets.",
            "Reviewer checks for quality and compliance."
        ],
        employee_count=5,
        charge_required=False,
        estimated_price=0
    )
    
    tasks_db[tid] = mock_plan
    return mock_plan

@router.get("/{task_id}", response_model=TaskPlanResponse)
def get_task(task_id: int):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks_db[task_id]

@router.get("/{task_id}/employee-status", response_model=List[EmployeeStatus])
def get_task_employee_status(task_id: int):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks_db[task_id].employees_needed
