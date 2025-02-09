from pydantic import BaseModel
from typing import List

class Question(BaseModel):
    descr: str

class QuestionChooseOption(BaseModel):
    text: str
    is_correct: bool

class QuestionChoose(Question):
    options: List[QuestionChooseOption]

class QuestionEssay(Question):
    pass

class QuestionChooseGroup(Question):
    choose_questions: List[QuestionChoose]
