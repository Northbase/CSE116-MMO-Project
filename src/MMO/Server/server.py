import json
import socket
from threading import Thread
from random import randint
from flask import Flask, send_from_directory, request, render_template
from flask_socketio import SocketIO

import eventlet
eventlet.monkey_patch()

app = Flask(__name__)
socket_server = SocketIO(app)


@app.route('/')
def index():
    return send_from_directory('../FrontEnd', 'index.html')


@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../FrontEnd', filename)


if __name__ == "__main__":
    app.run(port=8080, debug=True)