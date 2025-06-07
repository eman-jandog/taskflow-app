# mainapp/blueprints/todos/models.py
from mainapp.app import db

class Todo(db.Model):
    __tablename__ = "todos"
    tid = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.uid', name='fk_todos_user_id'), nullable=False, index=True)  # Add foreign key to link to Users
    text = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    creation_date = db.Column(db.Date, nullable=False, default=db.func.current_date())
    completed_date = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'Todo(tid={self.tid}, text={self.text})'