from marshmallow import Schema, fields, ValidationError
class TodoSchema(Schema):
    tid = fields.Int()
    user_id = fields.Int()
    text = fields.Str()
    completed = fields.Bool()
    creation_date = fields.Date(required=False)
    completed_date = fields.Date(required=False, allow_none=True)

class UserSchema(Schema):
    uid = fields.Int()
    username = fields.Str()
    email = fields.Str()
    password = fields.Str()
    role = fields.Str()
    todos = fields.Nested(TodoSchema, many=True)