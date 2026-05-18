from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
import logging
from app.models import Employee, WorkflowStep
from app.schemas import EmployeeCreate, WorkflowStepCreate

logger = logging.getLogger(__name__)

def get_employees(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    department: Optional[str] = None
) -> List[Employee]:
    """
    Retrieve a list of employees with search and department filtering.
    """
    try:
        query = db.query(Employee)
        
        if search:
            query = query.filter(
                or_(
                    Employee.name.ilike(f"%{search}%"),
                    Employee.role.ilike(f"%{search}%")
                )
            )
            
        if department and department != "All":
            query = query.filter(Employee.department == department)
            
        employees = query.offset(skip).limit(limit).all()
        logger.info(f"Successfully retrieved {len(employees)} employees (search: '{search}', department: '{department}').")
        return employees
    except Exception as e:
        logger.error(f"Error retrieving employees: {e}")
        raise e

def get_employee(db: Session, employee_id: int) -> Optional[Employee]:
    """
    Retrieve a single employee by their ID.
    """
    try:
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if employee:
            logger.info(f"Retrieved employee with ID {employee_id}")
        else:
            logger.warning(f"Employee with ID {employee_id} not found")
        return employee
    except Exception as e:
        logger.error(f"Error retrieving employee {employee_id}: {e}")
        raise e

def create_employee(db: Session, employee_data: EmployeeCreate) -> Employee:
    """
    Create a new employee record.
    """
    try:
        db_employee = Employee(**employee_data.model_dump())
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        logger.info(f"Successfully created employee operator: '{db_employee.name}' (ID: {db_employee.id})")
        return db_employee
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating employee: {e}")
        raise e

def update_employee(db: Session, employee_id: int, employee_data: EmployeeCreate) -> Optional[Employee]:
    """
    Update an existing employee record.
    """
    try:
        db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not db_employee:
            logger.warning(f"Failed to update employee {employee_id}: not found")
            return None
            
        update_data = employee_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_employee, key, value)
            
        db.commit()
        db.refresh(db_employee)
        logger.info(f"Successfully updated employee operator ID {employee_id}")
        return db_employee
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating employee {employee_id}: {e}")
        raise e

def delete_employee(db: Session, employee_id: int) -> bool:
    """
    Delete an employee record and cascade delete associated workflow steps.
    """
    try:
        db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not db_employee:
            logger.warning(f"Failed to delete employee {employee_id}: not found")
            return False
            
        # Delete related steps first to ensure clean referential integrity
        db.query(WorkflowStep).filter(WorkflowStep.employee_id == employee_id).delete()
        
        db.delete(db_employee)
        db.commit()
        logger.info(f"Successfully terminated/deleted employee operator ID {employee_id}")
        return True
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting employee {employee_id}: {e}")
        raise e

def get_employee_steps(db: Session, employee_id: int) -> List[WorkflowStep]:
    """
    Retrieve all workflow steps for a specific employee ordered by step_order.
    """
    try:
        steps = db.query(WorkflowStep)\
                  .filter(WorkflowStep.employee_id == employee_id)\
                  .order_by(WorkflowStep.step_order)\
                  .all()
        logger.info(f"Retrieved {len(steps)} steps for employee operator ID {employee_id}")
        return steps
    except Exception as e:
        logger.error(f"Error retrieving steps for employee {employee_id}: {e}")
        raise e

def create_employee_step(db: Session, employee_id: int, step_data: WorkflowStepCreate) -> WorkflowStep:
    """
    Create a workflow step for a specific employee.
    """
    try:
        db_step = WorkflowStep(**step_data.model_dump(), employee_id=employee_id)
        db.add(db_step)
        db.commit()
        db.refresh(db_step)
        logger.info(f"Successfully added workflow step {db_step.step_order} to employee operator ID {employee_id}")
        return db_step
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating step for employee {employee_id}: {e}")
        raise e
