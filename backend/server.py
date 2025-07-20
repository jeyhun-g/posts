import os
import json

from pydantic import BaseModel
from dotenv import load_dotenv

from google.adk.sessions import InMemorySessionService
from google.genai import types

from src import create_agent, init_server
from src.server.dynamodb import put_item

# Load environment variables
load_dotenv()

# Application constants
APP_NAME = "calendar_chat_app"
USER_ID = "test_user"

agent = create_agent()
session_service = InMemorySessionService()
app = init_server(app_name=APP_NAME, agent=agent, session_service=session_service)
  
class AnalyzeRequest(BaseModel):
    url: str

@app.get("/health")
async def health():
    service_name = os.getenv("SERVICE_NAME")
    return { "service_name": service_name, "status": "okay" }

@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    # Construct user content for the calendar agent
    put_item(request.url)

    session = session_service.create_session(app_name=APP_NAME, user_id=USER_ID)
    content = types.Content(
        role="user",
        parts=[types.Part(text=request.url)]
    )

    # Retrieve runner and session info from app state
    runner = app.state.runner

    # Execute the agent and capture the final response
    final_response = ""
    async for event in runner.run_async(
        user_id=USER_ID,
        session_id=session.id,
        new_message=content
    ):
        if event.is_final_response():
            final_response = event.content.parts[0].text

    return { "response": json.loads(final_response) }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
    )