from pydantic import BaseModel
from typing import List, Optional, Literal

class Question(BaseModel):
    type: str
    descr: str
    media: Optional[str] = None
    media_text: Optional[str] = None

class QuestionChooseOption(BaseModel):
    text: str
    is_correct: bool

class QuestionChoose(Question):
    type: Literal["choose"]  # type: ignore
    options: List[QuestionChooseOption]

class QuestionEssay(Question):
    type: Literal["essay"]  # type: ignore

class QuestionChooseGroup(Question):
    type: Literal["choose_group"]  # type: ignore
    choose_questions: List[QuestionChoose]
