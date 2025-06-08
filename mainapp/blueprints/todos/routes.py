from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import login_required, current_user
from mainapp.blueprints.todos.models import Todo
from mainapp.app import db


todos = Blueprint('todos', __name__, template_folder='templates')


@todos.route('/')
@login_required
def index():
    todos = Todo.query.filter(Todo.user_id == current_user.uid).all()
    return render_template('todos/index.html', todo_lists=todos)

@todos.route('/update', methods=['GET', 'DELETE', 'PATCH', 'POST'])
@login_required
def update():
    # add
    if request.method == 'POST':
        text = request.form.get('text')
        if text:
            new_todo = Todo(text=text, user_id=current_user.uid)
            db.session.add(new_todo)
            db.session.commit()

    # remove
    elif request.method == 'DELETE':
        tid = request.args.get('tid')
        print(tid)
        todo = Todo.query.filter(Todo.tid == tid, Todo.user_id == current_user.uid).first_or_404()
        if todo:
            db.session.delete(todo)
            db.session.commit()

    # update completed
    elif request.method == 'PATCH':
        tid = request.form.get('tid')
        todo = Todo.query.filter(Todo.tid == tid, Todo.user_id == current_user.uid).first_or_404()
        if todo:
            todo.completed = not todo.completed
            todo.completed_date = db.func.current_timestamp() if todo.completed else None
            db.session.commit()   

    elif request.method == 'GET':
        filter = request.args.get('filter')

        match filter:
            case 'active':
                todos = Todo.query.filter(Todo.user_id == current_user.uid, Todo.completed == False).all()
                return render_template('todos/_todo_list.html', todo_lists=todos)
            case 'completed':
                todos = Todo.query.filter(Todo.user_id == current_user.uid, Todo.completed == True).all()
                return render_template('todos/_todo_list.html', todo_lists=todos)
        
    # render    
    if request.headers.get('HX-Request'): 
        todos = Todo.query.filter(Todo.user_id == current_user.uid).all()
        return render_template('todos/_todo_list.html', todo_lists=todos)
    return redirect(url_for('todos.index'))