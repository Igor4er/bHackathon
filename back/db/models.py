from peewee import Model, CharField, TextField, BooleanField, DateTimeField
from db.db import db
import datetime


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

    class Meta:
        table_name = 'users'

class Quest(Base):
    ...


class Task(Base):
    ...

db.connect()
db.create_tables([User])
db.close()
