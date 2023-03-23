from flask import Flask
from flask_mail import Mail
import os
app = Flask(__name__)
app.secret_key = '1'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = '111.com'
app.config['MAIL_PASSWORD'] = '1111'
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USE_TLS'] = False
mail = Mail(app)

