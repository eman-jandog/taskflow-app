from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt


db = SQLAlchemy()

def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./appdb.db'
    app.secret_key = "SOME KEY HERE"

    db.init_app(app)

    loginManager = LoginManager()
    loginManager.init_app(app)
    loginManager.login_view = 'users.login'

    @loginManager.user_loader
    def load_user(uid):
        from mainapp.blueprints.users.models import Users
        return Users.query.get(uid)

    bcrypt = Bcrypt(app)

    from mainapp.blueprints.todos.routes import todos
    app.register_blueprint(todos, url_prefix='/todos')

    from mainapp.blueprints.users.routes import users
    app.register_blueprint(users, url_prefix='/', bcrypt=bcrypt)
    
    
    migrate = Migrate(app, db)

    return app