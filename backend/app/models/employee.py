from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database.db import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    role = Column(Text)
    department = Column(String, default="Engineering")
    productivity = Column(Integer, default=0) # e.g. 0-100 score
    status = Column(String, default="Active")
    avatar = Column(String)
    goal = Column(Text)
    tools = Column(String) # Stored as JSON string or comma-separated
    approval_rules = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    steps = relationship("WorkflowStep", back_populates="employee")
    executions = relationship("Execution", back_populates="employee")

class WorkflowStep(Base):
    __tablename__ = "workflow_steps"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    step_order = Column(Integer)
    instruction = Column(Text)

    employee = relationship("Employee", back_populates="steps")

class Execution(Base):
    __tablename__ = "executions"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    user_input = Column(Text)
    status = Column(String) # e.g., 'pending', 'running', 'completed', 'failed'
    final_output = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employee = relationship("Employee", back_populates="executions")
    logs = relationship("ExecutionLog", back_populates="execution")

class ExecutionLog(Base):
    __tablename__ = "execution_logs"

    id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(Integer, ForeignKey("executions.id"))
    step_number = Column(Integer)
    input = Column(Text)
    output = Column(Text, nullable=True)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    execution = relationship("Execution", back_populates="logs")
