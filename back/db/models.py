from peewee import AutoField, Model, CharField, TextField, BooleanField, DateTimeField, ForeignKeyField, IntegerField
from db.db import db
import json
import datetime


class JSONField(TextField):
    def db_value(self, value):
        return json.dumps(value, separators=(",", ":"))

    def python_value(self, value):
        if value is not None:
            return json.loads(value)


class Base(Model):
    class Meta:
        database = db


class User(Base):
    email = CharField(primary_key=True, unique=True)  # Primary key
    name = CharField(null=False)
    avatar_url = TextField(null=True)  # URL to user's avatar image
    created_at = DateTimeField(default=datetime.datetime.now)
    is_active = BooleanField(default=True)
    is_admin = BooleanField(default=False)


class Quest(Base):
    id = AutoField(primary_key=True)
    author = ForeignKeyField(User, backref='quests')
    name = CharField()
    desc = TextField()
    quest_body = JSONField()  # Will contain QuestBlock DTO
    max_players = IntegerField(default=1)
    max_attempts = IntegerField(default=1)
    created_at = DateTimeField(default=datetime.datetime.now)


db.connect()
db.create_tables([User, Quest])
db.close()
