from flask import Blueprint, render_template, request, redirect, url_for
from mainapp.app import db
from mainapp.blueprints.users.models import Users
from mainapp.blueprints.todos.models import Todos

admin = Blueprint('admin', __name__, template_folder='templates')


@admin.record
def record_params(setup_state):
    admin.bcrypt = getattr(setup_state, "options", None)['bcrypt']


@admin.route('/main')
def main():
    user_list = Users.query.all()
    return render_template('administrator/main.html', users=user_list, Todos=Todos)

@admin.route('/delete/<uid>', methods=['DELETE'])
def delete(uid):
    user = Users.query.filter(Users.uid == uid).first()
    todos = Todos.query.filter(Todos.user_id == user.uid).all()

    for todo in todos:
        db.session.delete(todo)

    db.session.delete(user)
    db.session.commit()
    return '', 200

@admin.route('/register', methods=['GET','POST'])
def register():
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')

        hash_password = admin.bcrypt.generate_password_hash(password).decode('utf-8')
        user = Users(username=username, password=hash_password, email=email, role="administrator")

        db.session.add(user)
        db.session.commit()
        
        return redirect(url_for('admin.main'))
    
    elif request.method == 'GET':
        return render_template('administrator/register.html')