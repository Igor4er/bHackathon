from fastapi import APIRouter, HTTPException, Depends
from peewee import DoesNotExist
from dto.quests.quest import *
from db.models import Quest

router = APIRouter(prefix="/quests/")


@router.post(path="/create/")
def create_quest():
    ...


@router.get(path="/get/{quest_id}")
def get_quest(quest_id: int):
    try:
        quest = Quest.get(Quest.id == quest_id)
        return quest
    except DoesNotExist:
        return None
    
    
@router.get(path="/get/")
def get_quests():
    return list(Quest.select())


@router.patch(path="/update/")
def update_quest():
    ...


@router.delete(path="/delete/{quest_id}")
def delete_quest(quest_id: int):
    try:
        quest = Quest.delete_by_id(Quest.id == quest_id)
        return {"message": "Quest deleted successfully"}
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Quest not found")