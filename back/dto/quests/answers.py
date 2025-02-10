from pydantic import BaseModel, UUID4
from typing import List
from .questions import QuestionChooseOption

class CommonAnswer(BaseModel):
    to_UUID: UUID4

class QuestionChooseAnswer(BaseModel):
    options: List[QuestionChooseOption]

class QuestionChooseGroupAnswer(BaseModel):
    choose_questions: List[QuestionChooseAnswer]

class QuestionEssayAnswer(BaseModel):
    text: str

class UserAnswer(BaseModel):
    question_id: UUID4
    answer: CommonAnswer
