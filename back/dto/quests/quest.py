from pydantic import BaseModel, Field
from typing import Dict, Optional, List
from datetime import timedelta, datetime
from .questions import Question


class QuestBlock(BaseModel):
    questions: Dict[str, Question] = Field(
            description="Dictionary of questions with UUID keys",
            examples=[{
                "550e8400-e29b-41d4-a716-446655440000": {
                    "type": "choose",
                    "descr": "What is 2+2?",
                    "options": [
                        {"text": "4", "is_correct": True},
                        {"text": "5", "is_correct": False}
                    ]
                }
            }]
        )
    time_limit: Optional[timedelta] = None
    randomize_questions: bool
    allow_switching_questions: bool
    allow_changing_answers: bool

class Quest(BaseModel):
    name: str
    desc: str
    quest_body: List[QuestBlock] = Field(
            description="List of quest blocks containing questions and settings",
            examples=[[{
                "questions": {
                    "550e8400-e29b-41d4-a716-446655440000": {
                        "type": "choose",
                        "descr": "What is 2+2?",
                        "options": [
                            {"text": "4", "is_correct": True},
                            {"text": "5", "is_correct": False}
                        ]
                    }
                },
                "time_limit": None,
                "randomize_questions": True,
                "allow_switching_questions": True,
                "allow_changing_answers": True
            }]]
        )
    max_players: int = 1
    max_attempts: int = 1

class QuestResponse(BaseModel):
    id: int
    name: str
    desc: str
    quest_body: List[QuestBlock] = Field(
            description="List of quest blocks containing questions and settings",
            examples=[{
                "questions": {
                    "550e8400-e29b-41d4-a716-446655440000": {
                        "type": "choose",
                        "descr": "What is 2+2?",
                        "options": [
                            {"text": "4", "is_correct": True},
                            {"text": "5", "is_correct": False}
                        ]
                    }
                },
                "time_limit": None,
                "randomize_questions": True,
                "allow_switching_questions": True,
                "allow_changing_answers": True
            }]
        )
    max_players: int
    max_attempts: int
    created_at: datetime

    class Config:
        from_attributes = True
