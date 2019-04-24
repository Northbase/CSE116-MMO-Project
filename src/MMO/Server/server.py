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
    return send_from_directory('static', 'index.html')

# if app "__main__":
#     app.run()


# socket_server.run(app, port=8080)
