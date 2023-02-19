from flask import render_template, request, redirect, url_for, flash
from flask_app import app, mail
from flask_mail import Message
from flask_bcrypt import Bcrypt
from flask_app.models.user import User

bcrypt = Bcrypt()

@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email')
        user = User.get_by_email(email)
        if user:
            reset_token = user.generate_reset_token()
            msg = Message('Password Reset Request', sender='your-email@example.com', recipients=[email])
            reset_url = url_for('reset_password', token=reset_token, _external=True)
            msg.body = f"""To reset your password, click the following link:
{reset_url}

If you did not make this request then simply ignore this email and no changes will be made.
"""
            mail.send(msg)
            flash('An email has been sent with instructions to reset your password.', 'success')
            return redirect(url_for('login'))
        else:
            flash('This email is not registered with us. Please register first.', 'danger')
            return redirect(url_for('register'))
    return render_template('forgot_password.html')


@app.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    user = User.verify_reset_token(token)
    if not user:
        flash('That is an invalid or expired token', 'danger')
        return redirect(url_for('forgot_password'))
    if request.method == 'POST':
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        if password == confirm_password:
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            user_data = {
                'id': user.id,
                'password': hashed_password
            }
            User.update(user_data)
            flash('Your password has been updated! You are now able to log in', 'success')
            return redirect(url_for('login'))
        else:
            flash("Passwords don't match", 'danger')
            return redirect(url_for('reset_password', token=token))
    return render_template('reset_password.html', token=token)


<!-- //// -->
import secrets
from datetime import datetime, timedelta

class User:
    # existing methods here...

    def generate_reset_token(self, expires_in=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expires_in)
        reset_token = s.dumps({'reset_password': self.id}).decode('utf-8')
        return reset_token

    @staticmethod
    def verify_reset_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return None
        user_id = data.get('reset_password')
        if user_id:
            return User.get_one({'id': user_id})
        return None


<!-- /////// -->

msg = Message(f"Welcome to Zync, {request.form['first_name']}!", sender="nono@gmail.com", recipients=[request.form['email']])
    msg.body = "welcome"
    with app.open_resource("static/assets/runningPeeps.png") as fp:
        image_data = fp.read()
        image_data_b64 = b64encode(image_data).decode('utf-8')
        msg.html = render_template('WelcomeEmail.html', image=image_data_b64)
        msg.attach("runningPeeps.png", "image/png", image_data, "inline", headers=[["Content-ID", "<logo>"]])
        mail.send(msg)