from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from mainapp.app import db
from mainapp.blueprints.users.models import User
from mainapp.blueprints.todos.models import Todo

admin = Blueprint('admin', __name__, template_folder='templates')


@admin.record
def record_params(setup_state):
    admin.bcrypt = getattr(setup_state, "options", None)['bcrypt']


@admin.route('/main')
@login_required
def main():
    if current_user.role == 'administrator':
        users = User.query.all()
        # todos = Todo.query.all()
        # for user in users:
        #     for todo in todos:
        #         if todo.user_id == user.uid:
        #             user['todos'] = [todo] if not user['todos'] else users[user]['todos'].append(todo)

        return render_template('administrator/main.html', user_lists=users)
    flash('Invalid url!', 'success')
    return redirect(url_for('users.login'))

@admin.route('/delete/<uid>', methods=['DELETE'])
@login_required
def delete(uid):
    user = User.query.filter(User.uid == uid).first()
    todos = Todo.query.filter(Todo.user_id == user.uid).all()

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
        confirm = request.form.get('confirm_password')
        email = request.form.get('email')

        if password != confirm:
            flash(f'Invalid password!', 'error')
            return redirect(url_for('admin.main'))

        hash_password = admin.bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(username=username, password=hash_password, email=email, role="administrator")

        db.session.add(user)
        db.session.commit()
        
        return redirect(url_for('admin.main'))
    
    elif request.method == 'GET':
        return render_template('administrator/register.html')