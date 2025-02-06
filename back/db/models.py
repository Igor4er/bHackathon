from peewee import Model
from db.db import db


class Base(Model):
    class Meta:
        database = db


class User(Base):
    ...


class Quest(Base):
    ...


class Task(Base):
    ...

db.connect()
db.close()