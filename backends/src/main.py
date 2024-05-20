from flask import Flask, jsonify, request, abort, session, send_file, render_template, redirect
from flask_cors import CORS
from flask_session import Session
import os
import json

import yfin as yfin
import login as login

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SECRET_KEY'] = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
Session(app)

@app.route('/', defaults={'req_path': 'index.html'})
@app.route('/<path:req_path>')
def dir_listing(req_path):
    if not session.get('logged_in') and req_path.find('.html') != -1:
        return redirect("/login", code=302)

    BASE_DIR = os.environ['FLASK_FRONTEND_ROOT']

    abs_path = os.path.join(BASE_DIR, req_path)
    if not os.path.exists(abs_path):
        return abort(404)

    if os.path.isfile(abs_path):
        return send_file(abs_path)

    files = os.listdir(abs_path)
    return render_template('files.html', files=files)

@app.route('/stock/<stock>', methods=['GET'])
def get_stock(stock):
    if not session.get('logged_in'):
        return redirect("/login", code=302)

    info = yfin.yfin(stock)
    res = info.get_yfinance()
    return jsonify(res)

@app.route('/currency/<currency>', methods=['GET'])
def get_currency(currency):
    if not session.get('logged_in'):
        return redirect("/login", code=302)

    info = yfin.yfin(f'{currency}=X')
    res = info.get_yfinance()
    return jsonify(res)

@app.route('/login', methods=['POST'])
def login_page():
    if 'username' not in request.form or 'password' not in request.form:
        abort(401, {'status': 'failed'})

    if login.do_login(request.form.get('username'), request.form.get('password')) == False:
        abort(401, {'status': 'failed'})

    session['logged_in'] = True
    return jsonify({'status': 'success'})

@app.route('/login', methods=['DELETE'])
def logout_page():
    if not session.get('logged_in'):
        return redirect("/login", code=302)

    session.pop('logged_in', None)
    return jsonify({'status': 'success'})

@app.route('/login', methods=['GET'])
def is_login():
    BASE_DIR = os.environ['FLASK_FRONTEND_ROOT']

    abs_path = os.path.join(BASE_DIR, 'login.html')
    return send_file(abs_path)

@app.route('/config', methods=['GET'])
def get_config():
    if not session.get('logged_in'):
        return redirect("/login", code=302)

    STORGE = os.environ['DATA_STORGE']
    with open(STORGE) as f:
        data = json.load(f)

    return jsonify(data)

@app.route('/config', methods=['POST'])
def edit_config():
    if not session.get('logged_in'):
        return redirect("/login", code=302)

    req = request.get_json()

    STORGE = os.environ['DATA_STORGE']
    with open(STORGE, 'w') as f:
        json.dump(req, f)

    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run()
