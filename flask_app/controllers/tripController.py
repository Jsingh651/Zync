from yelpapi import YelpAPI
from pprint import pprint
from flask_app import app
from flask_app.models.review import Review
from flask_app.models.users import User
from flask import Flask, redirect, session, render_template, flash,request, Markup
from flask import Flask, redirect, session, render_template, flash, request, jsonify
import json
import requests

@app.route("/flight/page")
def flightPage():
    if not session:
        return redirect('/privacy/policy')
    return render_template("FlightSearch.html")

@app.route("/create/review")
def createTrip():
    if not session:
        return redirect('/privacy/policy')
    reviews = Review.reviews_with_user()
    data = {'id': session['user_id']}
    user = User.get_one(data)

    return render_template("profile.html", reviews = reviews, user= user)

@app.route("/delete/review/<int:id>")
def deleteRoute(id):
    data = {
        'id': id
    }
    Review.delete(data)
    return redirect("/create/review")

@app.route('/register/review', methods=['POST'])
def registerReview():
    if not Review.validate(request.form):
        session['location'] = request.form['location']
        session['location_name'] = request.form['location_name']
        session['description'] = request.form['description']
        return redirect('/create/review')
    data = {
        'location_name': request.form['location_name'],
        'date_going': request.form['date_going'],
        'description': request.form['description'],
        'visitor_id': request.form['visitor_id'],
        "stars": request.form['stars'],
        "type": request.form['type'],
        "location": request.form['location'],
    }
    Review.register(data)
    return redirect("/create/review")
    
@app.route("/edit/review/<int:id>")

def editreview(id):
    if not session:
        return redirect('/privacy/policy')
    data = {'id': id}
    review = Review.get_one(data)
    user = session['user_id']
    return render_template("editForm.html", review = review,user = user)

@app.route('/edit/review', methods=['POST'])
def editReview():
    if not Review.validate(request.form):
        session['location'] = request.form['location']
        session['location_name'] = request.form['location_name']
        session['description'] = request.form['description']
        return redirect('/edit/review/' + str(request.form['id']))
    data = {
        'location_name': request.form['location_name'],
        'date_going': request.form['date_going'],
        'description': request.form['description'],
        'visitor_id': request.form['visitor_id'],
        "stars": request.form['stars'],
        "type": request.form['type'],
        "id": request.form['id'],
        "location": request.form['location'],
    }

    Review.update(data)
    return redirect("/create/review")



@app.route("/show/feed")
def showFeed():
    if not session:
        return redirect('/privacy/policy')
    content = Review.reviews_with_user()
    return render_template("feed.html", content = content)

