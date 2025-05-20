from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from mainapp.blueprints.todos.models import Todos 
from mainapp.app import db


todos = Blueprint('todos', __name__, template_folder='templates')


@todos.route('/')
@login_required
def index():
    todos_list = Todos.query.filter(Todos.user_id == current_user.uid).all()
    return render_template('todos/index.html', todos=todos_list)
    

@todos.route('/create', methods=['POST'])
@login_required
def create():
    description = request.form.get('description')

    new_todo = Todos(description=description, user_id=current_user.uid)

    db.session.add(new_todo)
    db.session.commit()    
    return redirect(url_for('todos.index'))

@todos.route('/delete/<tid>', methods=['DELETE'])
@login_required
def delete(tid):
    todo = Todos.query.filter(Todos.tid == tid, Todos.user_id == current_user.uid).first_or_404()
    if todo:
        db.session.delete(todo)
        db.session.commit()
        return '', 200
    else:
        return 'Invalid todo Id', 400
