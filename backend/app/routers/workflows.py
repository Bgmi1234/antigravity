from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database.db import get_db

router = APIRouter()

@router.put("/{step_id}", response_model=schemas.WorkflowStepResponse)
def update_workflow_step(step_id: int, step: schemas.WorkflowStepCreate, db: Session = Depends(get_db)):
    db_step = db.query(models.WorkflowStep).filter(models.WorkflowStep.id == step_id).first()
    if not db_step:
        raise HTTPException(status_code=404, detail="Step not found")
        
    update_data = step.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_step, key, value)
        
    db.commit()
    db.refresh(db_step)
    return db_step

@router.delete("/{step_id}")
def delete_workflow_step(step_id: int, db: Session = Depends(get_db)):
    db_step = db.query(models.WorkflowStep).filter(models.WorkflowStep.id == step_id).first()
    if not db_step:
        raise HTTPException(status_code=404, detail="Step not found")
        
    db.delete(db_step)
    db.commit()
    return {"detail": "Step deleted"}
