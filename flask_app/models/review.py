from flask_app.config.mysqlconnection import connectToMySQL
import re
from flask import flash
from flask_app import app
from flask_app.models import users
db = "SoloProject"

class Review:
    def __init__(self, data):
        self.id = data['id']
        self.location_name = data['location_name']
        self.date_going = data['date_going']
        self.description = data['description']
        self.visitor_id = data['visitor_id']
        self.stars = data['stars']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.type = data['type']
        self.location = data['location']
        self.user = None

    
    @classmethod
    def get_all(cls):
        query = 'SELECT * FROM destinations'
        results = connectToMySQL(db).query_db(query)
        return [cls(row) for row in results]

    @classmethod
    def get_one(cls, data):
        query = 'SELECT * FROM destinations WHERE id = %(id)s;'
        result = connectToMySQL(db).query_db(query, data)
        return cls(result[0])

    @classmethod
    def register(cls, data):
        query = '''
        INSERT INTO destinations
        (location_name, date_going, description, visitor_id,stars, type,location, created_at) 
        VALUES (%(location_name)s, %(date_going)s, %(description)s, %(visitor_id)s,%(stars)s ,%(type)s,%(location)s, NOW());
        '''
        return connectToMySQL(db).query_db(query, data)

    @classmethod
    def update(cls, data):
        query = 'UPDATE destinations SET location_name = %(location_name)s, date_going = %(date_going)s, description = %(description)s, stars = %(stars)s, type = %(type)s, location = %(location)s, visitor_id = %(visitor_id)s WHERE id = %(id)s;'
        return connectToMySQL(db).query_db(query, data)

    @classmethod
    def delete(cls, data):
        query = "DELETE from destinations WHERE id = %(id)s;"
        return connectToMySQL(db).query_db(query, data)


 


    @classmethod
    def reviews_with_user(cls):
        query = 'SELECT * FROM destinations LEFT JOIN users on destinations.visitor_id = users.id'
        results = connectToMySQL(db).query_db( query)
        # user = cls(results[0])
        reviews = []
        for data in results:
            single_review = cls(data)
            user_data = {
                'id': data['users.id'],
                'first_name':data['first_name'],
                'last_name': data['last_name'],
                'email': data['email'],
                'password':data['password'],
                'accepted':data['accepted'],
                'created_at':data['users.created_at'],
                'updated_at': data['users.updated_at'],
            }
            single_review.user = users.User(user_data)
            reviews.append(single_review)
        return reviews


    @staticmethod
    def validate(review):
            is_valid = True

            if len(review.get('location_name', '')) < 3:
                flash("Business Name must be at least 3 characters.", 'location_name_error')
                is_valid = False

            if len(review.get('location', '')) < 3:
                flash("City Name must be at least 3 characters.", 'city_name_error')
                is_valid = False

            if 'stars' not in review or int(review['stars']) < 1:
                flash("Rating is needed", "stars_error")
                is_valid = False

            if review.get('date_going') is None:
                flash("Date must be provided", "date_error")
                is_valid = False

            if len(review.get('description', '')) < 8:
                flash('Experience must be at least 8 characters', "description_error")
                is_valid = False

            return is_valid


