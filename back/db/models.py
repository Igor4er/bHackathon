from peewee import Model, CharField, TextField, BooleanField, DateTimeField
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
    ...


class Task(Base):
    ...

db.connect()
db.create_tables([User])
db.close()
