# AI Employee Workflow Builder - Backend

This backend orchestrates AI workflows using FastAPI, SQLite, Ollama, and AnythingLLM.

## Testing Guide

Follow these exact steps to run and test the application locally.

### 1. Start Ollama
Ensure your local Ollama instance is running.
```bash
ollama serve
```

### 2. Start Backend
Open a terminal, activate your virtual environment, and run the FastAPI server.
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

### 3. Open API Documentation
Navigate to the automatically generated Swagger UI to interact with your endpoints:
[http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Create an Employee
Use the `POST /employees` endpoint with the following payload:
```json
{
  "name": "AI Support Employee",
  "role_prompt": "You are a professional customer support employee. You are polite, accurate, and concise.",
  "goal": "Answer customer questions using company knowledge.",
  "tools": "ollama, anythingllm",
  "approval_rules": "Never invent facts. Never send messages automatically. Ask human approval before risky actions."
}
```

### 5. Add Workflow Steps
Use the `POST /employees/{employee_id}/steps` endpoint (replace `{employee_id}` with the ID returned from the previous step). Add each of the following instructions one by one, incrementing the `step_order` for each:
1. `Understand the customer question`
2. `Search company knowledge base`
3. `Draft a helpful answer`
4. `Verify the answer is supported by documents`
5. `Return final customer-ready reply`

*Example Step Payload:*
```json
{
  "step_order": 1,
  "instruction": "Understand the customer question"
}
```

### 6. Run the Employee Workflow
Use the `POST /execute/{employee_id}` endpoint to trigger the workflow with a mock customer question:
```json
{
  "user_input": "How do I reset my password?"
}
```

### Testing Integrations Separately
You can also verify your AI service connections independently via these GET endpoints:
- `GET /test-ollama` - Sends "Say hello" to Ollama and returns the response.
- `GET /test-anythingllm` - Asks "What is the password reset policy?" to your AnythingLLM workspace.
