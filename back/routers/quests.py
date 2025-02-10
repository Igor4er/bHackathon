from fastapi import APIRouter, HTTPException, Depends, status
from peewee import DoesNotExist
from typing import List, Optional
from dto.quests.quest import Quest, QuestResponse
from services.auth import get_db_user
from db.models import Quest as DBQuest, User as DBUser

router = APIRouter(prefix="/quests", tags=["quests"])


@router.post(
    path="/create/",
    response_model=QuestResponse,
    status_code=status.HTTP_201_CREATED,
    description="Create a new quest",
    responses={
        201: {"description": "Quest created successfully"},
        400: {"description": "Bad request"},
        401: {"description": "Not authenticated"}
    }
)
def create_quest(quest: Quest, user: DBUser = Depends(get_db_user)):
    x = quest.dict()
    print("!!!!", x, type(x))
    try:
        print(quest)
        new_quest = DBQuest.create(
            author=user,
            name=quest.name,
            desc=quest.desc,
            quest_body=quest.dict().get("quest_body"),
            max_players=quest.max_players,
            max_attempts=quest.max_attempts
        )
        return QuestResponse.from_orm(new_quest)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    path="/get/{quest_id}",
    response_model=Optional[QuestResponse],
    description="Get a quest by ID",
    responses={
        200: {"description": "Quest found"},
        404: {"description": "Quest not found"}
    }
)
def get_quest(quest_id: int):
    try:
        quest = DBQuest.get(DBQuest.id == quest_id)
        return QuestResponse.from_orm(quest)
    except DoesNotExist:
        return None


@router.get(
    path="/get/",
    response_model=List[QuestResponse],
    description="Get all quests"
)
def get_quests():
    return [QuestResponse.from_orm(quest) for quest in DBQuest.select()]


@router.delete(
    path="/delete/{quest_id}",
    status_code=status.HTTP_200_OK,
    description="Delete a quest",
    responses={
        200: {"description": "Quest deleted successfully"},
        404: {"description": "Quest not found"}
    }
)
def delete_quest(quest_id: int):
    try:
        _ = DBQuest.delete().where(DBQuest.id == quest_id).execute()
        return {"message": "Quest deleted successfully"}
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Quest not found")
