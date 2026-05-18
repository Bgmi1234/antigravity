from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas
from ..database.db import get_db
from ..services import employee_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# --- Employee Routes ---

@router.post("/", response_model=schemas.EmployeeResponse)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    try:
        return employee_service.create_employee(db, employee)
    except Exception as e:
        logger.error(f"Failed to create employee router endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Database insertion failed: {str(e)}")

@router.get("/", response_model=List[schemas.EmployeeResponse])
def read_employees(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    department: Optional[str] = None,
    db: Session = Depends(get_db)
):
    try:
        return employee_service.get_employees(db, skip=skip, limit=limit, search=search, department=department)
    except Exception as e:
        logger.error(f"Failed to read employees: {e}")
        raise HTTPException(status_code=500, detail="Internal server error retrieving operators list")

@router.get("/{employee_id}", response_model=schemas.EmployeeResponse)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    try:
        employee = employee_service.get_employee(db, employee_id)
        if employee is None:
            raise HTTPException(status_code=404, detail="Employee node not found")
        return employee
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to read employee {employee_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error retrieving operator node")

@router.put("/{employee_id}", response_model=schemas.EmployeeResponse)
def update_employee(employee_id: int, employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    try:
        db_employee = employee_service.update_employee(db, employee_id, employee)
        if db_employee is None:
            raise HTTPException(status_code=404, detail="Employee node not found")
        return db_employee
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update employee {employee_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error updating operator node")

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    try:
        success = employee_service.delete_employee(db, employee_id)
        if not success:
            raise HTTPException(status_code=404, detail="Employee node not found")
        return {"detail": "Employee terminated and deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete employee {employee_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error terminating operator node")

# --- Employee Step Routes ---

@router.post("/{employee_id}/steps", response_model=schemas.WorkflowStepResponse)
def create_workflow_step(employee_id: int, step: schemas.WorkflowStepCreate, db: Session = Depends(get_db)):
    try:
        db_employee = employee_service.get_employee(db, employee_id)
        if not db_employee:
            raise HTTPException(status_code=404, detail="Employee node not found")
        return employee_service.create_employee_step(db, employee_id, step)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create workflow step for employee {employee_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error adding step")

@router.get("/{employee_id}/steps", response_model=List[schemas.WorkflowStepResponse])
def read_workflow_steps(employee_id: int, db: Session = Depends(get_db)):
    try:
        db_employee = employee_service.get_employee(db, employee_id)
        if not db_employee:
            raise HTTPException(status_code=404, detail="Employee node not found")
        return employee_service.get_employee_steps(db, employee_id)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to read workflow steps for employee {employee_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error retrieving steps")
