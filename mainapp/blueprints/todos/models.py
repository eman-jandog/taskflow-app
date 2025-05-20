# mainapp/blueprints/todos/models.py
from mainapp.app import db

class Todos(db.Model):
    __tablename__ = "todos"
    tid = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.uid', name='fk_todos_uid'), nullable=False)  # Add foreign key to link to Users
    description = db.Column(db.String(200), nullable=False)

    # Define relationship to Users (optional, but helpful for querying)
    users = db.relationship('Users', backref=db.backref('todos', lazy=True))

    def __repr__(self):
        return f'Todo(tid={self.tid}, description={self.description})'