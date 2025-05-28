from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import login_required, current_user
from mainapp.blueprints.todos.models import Todos 
from mainapp.app import db


todos = Blueprint('todos', __name__, template_folder='templates')


@todos.route('/')
@login_required
def index():
    todos = Todos.query.filter(Todos.user_id == current_user.uid).all()
    return render_template('todos/index.html', todo_lists=todos)
    

@todos.route('/create', methods=['POST'])
@login_required
def create():
    text = request.form.get('text')
    if text:
        new_todo = Todos(text=text, user_id=current_user.uid)
        db.session.add(new_todo)
        db.session.commit()
    if request.headers.get('HX-Request'): 
        todos = Todos.query.filter(Todos.user_id == current_user.uid).all()
        return render_template('todos/_todo_list.html', todo_lists=todos)
    return redirect(url_for('todos.index'))

@todos.route('/delete/<tid>', methods=['DELETE'])
@login_required
def delete(tid):
    todo = Todos.query.filter(Todos.tid == tid, Todos.user_id == current_user.uid).first_or_404()
    if todo:
        db.session.delete(todo)
        db.session.commit()
    if request.headers.get('HX-Request'):
        todos = Todos.query.filter(Todos.user_id == current_user.uid).all()
        return render_template('todos/_todo_list.html', todo_lists=todos)
    return redirect(url_for('todos.index'))