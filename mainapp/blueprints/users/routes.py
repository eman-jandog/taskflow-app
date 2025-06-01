from flask import Blueprint, render_template, request, redirect, url_for,  flash, jsonify
from flask_login import login_user, logout_user, current_user
from mainapp.app import db
from mainapp.blueprints.users.models import Users

users = Blueprint('users',__name__, template_folder="templates")

@users.record
def record_params(setup_state):
    app = setup_state
    users.bcrypt = getattr(setup_state, 'options', None).get('bcrypt')

@users.route('/')
@users.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        if current_user.is_authenticated:
            return redirect(url_for('todos.index')) 
        
        elif not Users.query.filter(Users.role == 'administrator').first():
            flash("Account manager required!", 'error')
            return redirect(url_for('admin.register'))
        
        else:   
            return render_template('users/login.html')
        
    elif request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = Users.query.filter(Users.username == username).first()

        if not user:
            flash('Invalid username!', 'error')
            return redirect(url_for('users.login'))

        if users.bcrypt.check_password_hash(user.password, password):
            login_user(user)
            # separate normal user from admin
            if current_user.role == "administrator":
                return redirect(url_for('admin.main'))
            else:
                flash('Successfully login.', 'success')
                return redirect(url_for('todos.index')) 
        else:
            flash('Invalid password!', 'error')
            return redirect(url_for('users.login'))
        
@users.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')

    try:
        hash_password = users.bcrypt.generate_password_hash(password).decode('utf-8')
        user = Users(username=username, email=email, password=hash_password, role=None)

        db.session.add(user)
        db.session.commit()

        flash(f'Login your account!', 'success')
        return redirect(url_for('users.login'))

    except Exception as e:
        flash(f'Error: {e}', 'error')
        return redirect(url_for('users.login'))


@users.route('/logout')
def logout():
    logout_user()
    flash("Successfully logout", "success")
    return redirect(url_for('users.login'))

