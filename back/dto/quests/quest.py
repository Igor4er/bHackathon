from pydantic import BaseModel, UUID4
from typing import Dict, Optional
from datetime import timedelta
from .questions import Question

class QuestBlock(BaseModel):
    questions: Dict[UUID4, Question]
    time_limit: Optional[timedelta] = None
    randomize_questions: bool
    allow_switching_questions: bool
    allow_changing_answers: bool

class Quest(BaseModel):
    author: UUID4
    name: str
    desc: str
    quest_body: Dict
    max_players: int = 1
    max_attempts: int = 1
