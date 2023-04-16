from flask_app import app
from flask_app.controllers import userController, tripController
from flask import Flask
from flask_mysqldb import MySQL
import os
from dotenv import load_dotenv
load_dotenv()
app.config['MYSQL_DATABASE_HOST'] = os.environ.get('MYSQL_DATABASE_HOST', 'localhost')
app.config['MYSQL_DATABASE_PORT'] = int(os.environ.get('MYSQL_DATABASE_PORT', 3306))
app.config['MYSQL_DATABASE_DB'] = os.environ.get('MYSQL_DATABASE_DB', 'solo_project')
app.config['MYSQL_DATABASE_USER'] = os.environ.get('MYSQL_DATABASE_USER', 'root')
app.config['MYSQL_DATABASE_PASSWORD'] = os.environ.get('MYSQL_DATABASE_PASSWORD', 'rootroot')

mysql = MySQL()
mysql.init_app(app)
if __name__ == '__main__':
    app.run(debug = True, port = 5031)




    