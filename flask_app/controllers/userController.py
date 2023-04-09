from yelpapi import YelpAPI
from pprint import pprint
from flask_app import app
from flask import Flask, redirect, session, render_template, flash,request, Markup
from urllib.parse import quote


@app.template_filter()
def urlencode(value):
    return Markup(quote(value))


from flask_app.models.users import User
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt(app)

@app.route("/")
def redirectroute():
    return redirect("/register")
@app.route('/login')
def newuser():
    return render_template('Login.html')

@app.route("/register")
def newuseredit():
    return render_template("register.html")


@app.route('/register', methods=['POST'])
def register():

    if not User.validate(request.form):
        session['first_name'] = request.form['first_name']
        session['last_name'] = request.form['last_name']
        session['email'] = request.form['email']
        return redirect('/register')
    
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

    return redirect(f'/dashboard')

@app.route('/login/user', methods = ['POST'])
def login ():
    data = { "email" : request.form["email"] }
    user_in_db = User.get_by_email(data)
    if not user_in_db:
        flash("Invalid Email/Password")
        return redirect("/login")
    if not bcrypt.check_password_hash(user_in_db.password, request.form['password']):
        flash("Invalid Email/Password")
        return redirect('/login')
    session['user_id'] = user_in_db.id
    return redirect ('/dashboard')


@app.route('/dashboard')
def dashboard():
    if not session:
        return redirect('/privacy/policy')
    data = {'id': session['user_id']}
    return render_template('searchStation.html')

# Route that shows the dashboard get's one user #

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')


yelp_api = YelpAPI('k6sjLs3cUQXd-tCrwsHr_toAKMPKfOxWvBy5e6ZmUHs6tdLowuoYIKRuZ6d7fyh06d_qkqGet1l4eAa3URpbsQF2ZBdbqglgLiU9yjA1Q5bqudqH-Kb7uEDB5lQuZHYx')

@app.route("/ListOfRest")
def ListPage():
    if not session:
        return redirect('/privacy/policy')
    businesses = session.get('businesses', [])
    location = session['location']
    print("Location", location)
    return render_template("results.html", businesses=businesses, location = location)

@app.route("/api/search", methods=['POST'])
def returnapirSearch():
    location = request.form.get('location', session.get('location', None))
    if location is None:
        flash("Location not provided")
        return redirect('/')

    session['location'] = location
    term = request.form.get('term', 'Restaurant')
    session['term'] = term
    response = yelp_api.search_query(term=term, location=location)
    pprint(response)
    businesses = []
    for business in response['businesses']:
        businesses.append({
            "name": business['name'],
            "address": ", ".join(business['location']['display_address']),
            "rating": business['rating'],
            "phone": business['phone'],
            "image_url": business['image_url'],
            "url": business['url']
        })
    sorted_businesses = sorted(businesses, key=lambda x: float(x['rating']), reverse=True)
    session['businesses'] = sorted_businesses
    return redirect("/ListOfRest")

# New route for updating the term and redirecting to /api/search
@app.route("/update_term", methods=['POST'])
def update_term():
    term = request.form['term']
    session['term'] = term
    
    return returnapirSearch()

@app.route("/privacy/policy")
def troll():
    return render_template("Troll.html")
