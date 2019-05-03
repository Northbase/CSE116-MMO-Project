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

usernameToGame = {}

lobby = {"0": {}, "1": {}, "2": {}, "3": {}}

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
    message = json.loads(data)  # contains game state
    username = message["username"]
    user_socket = usernameToSid.get(username, None)
    if user_socket:
        socket_server.emit('message', data, room=user_socket)  # need to know more about room parameter...


def send_to_server(data):
    s.sendall(json.dumps(data).encode())


@socket_server.on('register')
def register(username):
    print(username + " registered")
    usernameToSid[username] = request.sid
    sidToUsername[request.sid] = username
    message = {"username": username, "action": "registered"}
    send_to_server(message)


@socket_server.on('disconnect')
def disconnect():
    if request.sid in sidToUsername:
        username = sidToUsername[request.sid]
        del sidToUsername[request.sid]
        del usernameToSid[username]
        for room, playersInRoom in lobby.items():
            if username in playersInRoom:
                del lobby[room][username]

        message = {"username": username, "action": "disconnected"}
        send_to_server(message)


@socket_server.on('joinRoom')
def join(data):
    username = sidToUsername[request.sid]
    if len(lobby[str(data["room"])]) < 7:
        message = {"username": username, "action": "joinRoom", "room": data["room"], "status": "pass"}
        lobby[str(data["room"])].update({username: data["continent"]})
    else:
        message = {"username": username, "action": "joinRoom", "room": data["room"], "status": "fail"}
    send_to_server(message)


@socket_server.on('playGame')
def play(data):
    username = sidToUsername[request.sid]
    occupiedContinent = lobby[str(data["room"])].values()
    if data["continent"] not in occupiedContinent:
        message = {"username": username, "action": "playGame", "room": data["room"], "continent": data["continent"], "status": "pass"}
        lobby[str(data["room"])].update({username: data["continent"]})
    else:
        message = {"username": username, "action": "playGame", "room": data["room"], "continent": data["continent"], "status": "fail"}
    send_to_server(message)


@socket_server.on('attack')
def attack(data):
    username = sidToUsername[request.sid]
    message = {"username": username, "action": "attack", "target": data["target"], "allocated": data["allocated"]}
    send_to_server(message)



@socket_server.on('defend')
def defend(data):
    username = sidToUsername[request.sid]
    message = {"username": username, "action": "defend", "allocated": data["allocated"]}
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
    return render_template('game.html', username=username)


if __name__ == "__main__":
    socket_server.run(app, port=8080, debug="true")

