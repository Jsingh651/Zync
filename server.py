from flask_app import app
from flask_app.controllers import userController, tripController
import mysql.connector

if __name__ == '__main__':
    app.run(debug = True, port = 5031)




    