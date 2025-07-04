import asyncio

from contextlib import asynccontextmanager
from google.adk.agents import LlmAgent

from fastapi import FastAPI
from starlette.datastructures import State

from google.adk.sessions import BaseSessionService
from google.adk.runners import Runner
from typing import Optional

class AppState(State):
    session_service: Optional[BaseSessionService] = None
    runner: Optional[Runner] = None

class CustomFastAPI(FastAPI):
    state: AppState

def init_server(app_name: str, session_service: BaseSessionService, agent: LlmAgent):
  @asynccontextmanager
  async def lifespan(app: FastAPI):
    runner = Runner(agent=agent, app_name=app_name, session_service=session_service)

    # Store services on app state for use in endpoints
    app.state.session_service = session_service
    app.state.runner = runner

    yield
    pass

  app = CustomFastAPI(lifespan=lifespan)
  return app