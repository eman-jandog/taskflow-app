from mainapp.app import db

class Users(db.Model):
    __tablename__ = 'users'
    uid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    role = db.Column(db.String)

    @property
    def is_active(self):
        return True
    
    @property
    def is_authenticated(self):
        return True
    
    @property
    def is_anonymous(self):
        return False
    
    def get_id(self):
        return str(self.uid)

    def __str__(self):
        return f'<Id:>{self.uid}, <Username:> {self.username}, <Password:> *********, <Role:> {self.role}'

    