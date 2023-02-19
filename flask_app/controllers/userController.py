from flask_app import app, mail
from flask_mail import Mail, Message
from base64 import b64encode
from flask_app import app
from flask import Flask, redirect, session, request, render_template, url_for, flash
from flask_app.models.users import User
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt(app)


@app.route("/")
def index():
    
    return redirect("/dashboard")

@app.route("/privacy/policy")
def tos ():
    return render_template("privacyPolicy.html")

@app.route('/login/user')
def newuser():
    return render_template('Login.html')

@app.route("/register")
def newuseredit():
    return render_template("register.html")

@app.route('/sendEmail')
def sendEmail():
    data = {'id': session['user_id']}
    session['username'] = data['first_name']
    users = User.get_one(data)
    return render_template('WelcomeEmail.html')


@app.route('/register', methods=['POST'])
def register():
    if not User.validate(request.form):
        session['first_name'] = request.form['first_name']
        session['last_name'] = request.form['last_name']
        session['email'] = request.form['email']
        return redirect('/register')  # back to login page

    pw_hash = bcrypt.generate_password_hash(request.form['password'])
    data = {
        'first_name': request.form['first_name'],
        'last_name': request.form['last_name'],
        'email': request.form['email'],
        'accepted': request.form['accepted'],
        'password': pw_hash
    }

    first_name = request.form['first_name']
    first_name.capitalize()
    
    
    id = User.register(data)
    session['user_id'] = id
    session['username'] = data['first_name']
    print('session', session)

    return redirect(f'/dashboard')





# Login User route with post method form, lets users login #
@app.route('/login/user', methods = ['POST'])
def login ():
    data = { "email" : request.form["email"] }
    user_in_db = User.get_by_email(data)
    if not user_in_db:
        flash("Invalid Email/Password", 'login_error')
        return redirect("/login/user")
    if not bcrypt.check_password_hash(user_in_db.password, 
                                request.form['password']):
        flash("Invalid Email/Password")
        return redirect('/')
    session['user_id'] = user_in_db.id
    return redirect ('/dashboard')




# Route that shows the dashboard get's one user #
@app.route('/dashboard')
def dashboard():
    # if 'user_id' not in session:
    #     flash("You must be logged in to access the dashboard.")
    #     return redirect("/")
    data = {'id': session['user_id']}
    return render_template('dashboard.html', user = User.get_one(data))



@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')



