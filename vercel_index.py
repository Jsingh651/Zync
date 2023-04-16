from flask_app import app  # Import your Flask app as you did in your main file
from mangum import Mangum

handler = Mangum(app)
