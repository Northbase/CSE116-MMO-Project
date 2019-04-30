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

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('localhost', 8000))
s.listen(1)

conn, addr = s.accept()
print('Connection address:', addr)
while 1:
    data = conn.recv(1024)
    if not data:
        break
    print("received data:", data)
    conn.send(data)
conn.close()






@socket_server.on('connect')
def got_message():
    print(request.sid + " connected")
    message = {"username": request.sid, "action": "connected"}
    # send_to_scala(message)


@socket_server.on('disconnect')
def disconnect():
    print(request.sid + " disconnected")
    message = {"username": request.sid, "action": "disconnected"}
    # send_to_scala(message)


@app.route('/')
def index():
    return send_from_directory('../FrontEnd', 'index.html')


@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../FrontEnd', filename)


# if __name__ == "__main__":
#     socket_server.run(app, port=8080, debug="true")
    # app.run(port=8080, debug=True)
