from flask_app.config.mysqlconnection import connectToMySQL
import re
from flask import flash
from flask_app import app

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$') 

db = "zync"

class User:
    def __init__(self, data):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.email = data['email']
        self.password = data['password']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.accepted = data['accepted']

    @classmethod
    def get_all(cls):
        query = 'SELECT * FROM users'
        results = connectToMySQL(db).query_db(query)
        return [cls(row) for row in results]

    @classmethod
    def get_one(cls, data):
        query = 'SELECT * FROM users WHERE id = %(id)s;'
        result = connectToMySQL(db).query_db(query, data)
        return cls(result[0])

    @classmethod
    def register(cls, data):
        query = '''
        INSERT INTO users
        (first_name, last_name, email, password, accepted, created_at) 
        VALUES (%(first_name)s, %(last_name)s, %(email)s, %(password)s,%(accepted)s, NOW());
        '''
        return connectToMySQL(db).query_db(query, data)

    @classmethod
    def update(cls, data):
        query = 'UPDATE users SET first_name = %(first_name)s, last_name = %(last_name)s, email = %(email)s WHERE id = %(id)s;'
        return connectToMySQL(db).query_db(query, data)

    @classmethod
    def delete(cls, data):
        query = "DELETE from users WHERE id = %(id)s;"
        return connectToMySQL(db).query_db(query, data)

    @classmethod
    def get_by_email(cls, email):
        query = "SELECT * FROM users WHERE email = %(email)s;"
        result = connectToMySQL(db).query_db(query, {'email': email})
        return cls(result[0]) if result else None

    @staticmethod
    def validate(user):
        is_valid = True
        if User.get_by_email(user['email']):
            flash('Email already exists', 'exsist')
            is_valid = False

        if not user.get("accepted"):
            flash('You must accept the terms and conditions', 'accepted_error')
            is_valid = False

        if len(user['first_name']) < 3:
            flash("First Name must be at least 3 characters.", 'first_name_error')
            is_valid = False

        if len(user['last_name']) < 3:
            flash("Last Name must be at least 3 characters.", "last_name_error")
            is_valid = False

        if not EMAIL_REGEX.match(user['email']): 
            flash("Invalid email address!", "email_error")
            is_valid = False
        if len(user['password']) < 8:
            flash('Password must be at least 8 characters', "password_error")
            is_valid = False
        # if user.get('password') != user.get('confirm_password'):
        #     flash("Passwords don't match")
        #     is_valid = False
        return is_valid
    



