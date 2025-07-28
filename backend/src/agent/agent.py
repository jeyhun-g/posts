from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.models.lite_llm import LiteLlm
from .prompt import PROMPT_V1, generate_output_schema
from pydantic import BaseModel, Field
from typing import Literal, Optional

class TopicModel(BaseModel):
    name: str = Field(description="Topic or keyword name")
    level: Literal["Beginner", "Intermediate", "Advanced"]

class AgentOutput(BaseModel):
    keywords: list[TopicModel] = Field(description="List of extracted keywords")
    error: Optional[str] = Field(description="Optional error message, if keywords couldn't be found")


def create_agent():
    output_agent = LlmAgent(
        name="output_agent_v1",
        model=LiteLlm("openai/gpt-4.1"),
        description="An AI Agent to generate JSON output for a given schema from input. This agent is the last step in the process",
        instruction=generate_output_schema(AgentOutput),
    )

    agent = LlmAgent(
        name="posts_agent_v1",
        model=LiteLlm("openai/gpt-4.1"),
        description="An AI agent that identifies and ranks core topics in technical or educational content by depth and domain expertise—filtering out non-informational sources automatically.",
        instruction=PROMPT_V1
    )

    main_agent = SequentialAgent(name="Pipeline", sub_agents=[agent, output_agent])

    return main_agent