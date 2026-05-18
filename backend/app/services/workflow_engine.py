from sqlalchemy.orm import Session
from .. import models
from . import ollama_service, anythingllm_service

RISKY_KEYWORDS = ["send email", "delete", "publish", "payment", "purchase", "message customer"]

def is_risky(text: str) -> bool:
    text_lower = text.lower()
    for keyword in RISKY_KEYWORDS:
        if keyword in text_lower:
            return True
    return False

def run_workflow(db: Session, employee_id: int, user_input: str) -> models.Execution:
    # 1 & 2. Load employee and workflow steps
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise ValueError("Employee not found")

    steps = db.query(models.WorkflowStep).filter(models.WorkflowStep.employee_id == employee_id).order_by(models.WorkflowStep.step_order).all()
    if not steps:
        raise ValueError("No workflow steps defined for this employee")

    # 3. Create Execution record
    execution = models.Execution(
        employee_id=employee_id,
        user_input=user_input,
        status="running"
    )
    db.add(execution)
    db.commit()
    db.refresh(execution)

    company_knowledge = ""
    # Check if anythingllm is in tools
    employee_tools = employee.tools.lower() if employee.tools else ""
    if "anythingllm" in employee_tools:
        try:
            company_knowledge = anythingllm_service.ask_workspace(user_input)
        except Exception as e:
            company_knowledge = f"[AnythingLLM Error: {str(e)}]"

    previous_outputs = []
    
    # 4. Iterate through steps
    for step in steps:
        if is_risky(step.instruction):
            execution.status = "approval_required"
            db.commit()
            return execution

        # Build prompt
        prompt_parts = [
            f"Role: {employee.role_prompt or 'You are an AI assistant.'}",
            f"Goal: {employee.goal or 'Assist the user.'}",
            f"Rules: {employee.approval_rules or 'None.'}",
            f"User Input: {user_input}",
            f"Current Step: {step.instruction}"
        ]
        
        if company_knowledge:
            prompt_parts.insert(3, f"Company Knowledge: {company_knowledge}")
            
        if previous_outputs:
            prompt_parts.append("Previous Steps Outputs:\n" + "\n".join(previous_outputs))

        full_prompt = "\n\n".join(prompt_parts)
        
        # Call Ollama
        try:
            step_output = ollama_service.generate_response(full_prompt)
        except Exception as e:
            step_output = f"Error generating response: {str(e)}"
            
        if is_risky(step_output):
            execution.status = "approval_required"
            db.commit()
            return execution

        previous_outputs.append(f"Step {step.step_order} output: {step_output}")

        # Save ExecutionLog
        log = models.ExecutionLog(
            execution_id=execution.id,
            step_number=step.step_order,
            input=full_prompt,
            output=step_output,
            status="completed"
        )
        db.add(log)
        db.commit()

    # 5 & 6. Final output & status
    execution.final_output = previous_outputs[-1].split("output: ", 1)[-1] if previous_outputs else ""
    execution.status = "completed"
    db.commit()
    db.refresh(execution)

    return execution
