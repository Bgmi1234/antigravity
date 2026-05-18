from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from .. import models, schemas
from ..database.db import get_db
from ..services import workflow_engine

router = APIRouter()

class ExecuteRequest(BaseModel):
    user_input: str

@router.post("/execute/{employee_id}")
def execute_workflow(employee_id: int, request: ExecuteRequest, db: Session = Depends(get_db)):
    try:
        execution = workflow_engine.run_workflow(db, employee_id, request.user_input)
        return {
            "execution_id": execution.id,
            "status": execution.status,
            "final_output": execution.final_output
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/executions/{execution_id}", response_model=schemas.ExecutionResponse)
def read_execution(execution_id: int, db: Session = Depends(get_db)):
    execution = db.query(models.Execution).filter(models.Execution.id == execution_id).first()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    return execution

@router.get("/executions/{execution_id}/logs", response_model=List[schemas.ExecutionLogResponse])
def read_execution_logs(execution_id: int, db: Session = Depends(get_db)):
    execution = db.query(models.Execution).filter(models.Execution.id == execution_id).first()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
        
    logs = db.query(models.ExecutionLog).filter(models.ExecutionLog.execution_id == execution_id).order_by(models.ExecutionLog.step_number).all()
    return logs
