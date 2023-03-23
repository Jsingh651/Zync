from flask import Flask
from flask_mail import Mail
import os
app = Flask(__name__)
app.secret_key = 'helefvefvr4332432lo'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'jangsing02@gmail.com'
app.config['MAIL_PASSWORD'] = 'zkgfklffuiukdcio'
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USE_TLS'] = False
mail = Mail(app)

