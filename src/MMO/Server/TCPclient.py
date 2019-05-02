import json
import socket
from threading import Thread
from random import randint

from flask import Flask, send_from_directory, request, render_template
from flask_socketio import SocketIO

import eventlet

eventlet.monkey_patch()

app = Flask(__name__, template_folder="../FrontEnd/templates", static_folder="../FrontEnd/static")
socket_server = SocketIO(app)

usernameToSid = {}
sidToUsername = {}
lobby = {}

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('localhost', 8000))


def listen_to_server(the_socket):
    delimiter = "~"
    buffer = ""
    while True:
        buffer += the_socket.recv(1024).decode()
        while delimiter in buffer:
            message = buffer[:buffer.find(delimiter)]
            buffer = buffer[buffer.find(delimiter) + 1:]
            get_from_server(message)


Thread(target=listen_to_server, args=(s,)).start()


def get_from_server(data):
    print(data)
    # message = json.loads(data)
    # socket_server.emit("test", data, broadcast=True)


def send_to_server(data):
    s.sendall(json.dumps(data).encode())


# @socket_server.on('connect')
# def connect():
#     print(request.sid + " connected")
#     message = {"username": request.sid, "action": "connected"}
#     send_to_server(message)


@socket_server.on('disconnect')
def disconnect():
    print(request.sid + " disconnected")
    if request.sid in sidToUsername:
        username = sidToUsername[request.sid]
        del sidToUsername[request.sid]
        del usernameToSid[username]
        message = {"username": request.sid, "action": "disconnected"}
        send_to_server(message)


@socket_server.on('register')
def register(username):
    print(username + " registered")
    usernameToSid[username] = request.sid
    sidToUsername[request.sid] = username
    message = {"username": username, "action": "registered"}
    print(usernameToSid)
    send_to_server(message)


@socket_server.on('play')
def play():
    message = {"username": request.sid, "action": "play"}
    send_to_server(message)


@socket_server.on('attack')
def play():
    message = {"username": request.sid, "action": "attack"}
    send_to_server(message)


@socket_server.on('defend')
def play():
    message = {"username": request.sid, "action": "defend"}
    send_to_server(message)


@app.route('/')
def index():
    return send_from_directory('../FrontEnd/templates', 'index.html')


@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../FrontEnd/static', filename)


@app.route('/game', methods=["POST", "GET"])
def game():
    if request.method == "POST":
        username = request.form.get('username')
    else:
        username = "guest" + str(randint(0, 100000))
    # return send_from_directory('../FrontEnd/templates', 'game.html', username=username)
    return render_template('game.html', username=username)


socket_server.run(app, port=8080, debug="true")

# if __name__ == "__main__":
#     socket_server.run(app, port=8080, debug="true")

