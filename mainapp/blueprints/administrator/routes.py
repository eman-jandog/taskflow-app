from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, Response
from flask_login import login_required, current_user
from mainapp.app import db
from mainapp.blueprints.users.models import User
from mainapp.blueprints.todos.models import Todo
from mainapp.static.schema.schema import TodoSchema, UserSchema, ValidationError
import json

admin = Blueprint('admin', __name__, template_folder='templates')


@admin.record
def record_params(setup_state):
    admin.bcrypt = getattr(setup_state, "options", None)['bcrypt']


@admin.route('/')
@login_required
def main():
    if current_user.role == 'administrator':
        users = User.query.all()
        todos = Todo.query.all()
        return render_template('administrator/main.html', user_lists=users, todo_lists=todos)
    
    flash('Invalid url!', 'success')
    return redirect(url_for('users.login'))

@admin.route('/backup')
def backup():
    users = User.query.all()
    data = UserSchema(many=True).dump(users)
    response = jsonify(data)
    response.headers['Content-Disposition'] = 'attachment; filename=database_backup.json'
    return response

@admin.route('/update', methods=['POST'])
def update():
    if 'file' not in request.files:
        return "No file uploaded", 400
    file = request.files['file']

    try:
        json_data = json.load(file)
    except json.JSONDecodeError:
        return "Invalid JSON format", 400
    
    try: 
        users_data = UserSchema(many=True).load(json_data)
        print(users_data)
    except ValidationError as err:
        return f'Data validation error: {str(err)}', 400
    
    try:
        db.session.query(User).delete()
        db.session.query(Todo).delete()
        for user_data in users_data:
            user = User(
                email=user_data['email'],
                password=user_data['password'],
                role=user_data['role'],
                uid=user_data['uid'],
                username=user_data['username']
            )
            db.session.add(user)  
            if 'todos' in user_data:
                for todo_data in user_data['todos']:
                    todo = Todo(
                        completed=todo_data['completed'],
                        completed_date=todo_data.get('completed_date'),
                        creation_date=todo_data['creation_date'],
                        text=todo_data['text'],
                        tid=todo_data['tid'],
                        user_id=todo_data['user_id']
                    )
                    db.session.add(todo)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return f"Database error: {e}", 500  
    
    return jsonify({'message': "Database updated successfully"}), 200

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