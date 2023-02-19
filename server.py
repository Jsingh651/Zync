from flask_app import app
from flask_app.controllers import userController

if __name__ == '__main__':
    app.run(debug = True, port = 5031)


from flask_app import app

if __name__ == '__main__':
    app.run(debug = True)