import json
import socket
import time
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
clientUserName = {}
usernameToContinent = {}
lobby = {"0": {}, "1": {}, "2": {}, "3": {}}
# targetID = {} # placeholder

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


# maybe go back to original method... this is really bugy
def get_from_server(data):
    # gameState = loaded["Unclaimed"]  # contains game state
    username = clientUserName.get("username", None)
    loaded = json.loads(data)

    if username:
        # print(loaded)
        user_socket = usernameToSid.get(username, None)
        if user_socket:
            # print(loaded)
            continent = usernameToContinent.get(username, "Unclaimed")
            gameState = loaded.get(continent, loaded["Unclaimed"])  # contains game state
            # gameState = loaded[username]
        # print(loaded.keys(), usernameToContinent[username] in loaded.keys())
        # print(username in loaded.keys())
        # print("LOADed: ", loaded)
        # print("GS: ", gameState)
        # if gameState["continent"] != "Unclaimed":
        for room, player in lobby.items():
            if username in player.keys():
                lobby[room].update({username: gameState})
        package = {"username": username, "gameState": lobby}
        # print(package)

        user_socket = usernameToSid.get(username, None)
        if user_socket:
            socket_server.emit('message', package)  # need to know more about room parameter...


def send_to_server(data):
    s.sendall(json.dumps(data).encode())


@socket_server.on('register')
def register(username):
    print(username + " registered")
    clientUserName["username"] = username
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
    occupiedContinent = lobby[data["room"]].values()
    if data["continent"] not in occupiedContinent:
        usernameToContinent[username] = data["continent"]
        message = {"username": username, "action": "playGame", "room": data["room"], "continent": data["continent"], "status": "pass"}
        lobby[data["room"]].update({username: data["continent"]})
    else:
        message = {"username": username, "action": "playGame", "room": data["room"], "continent": data["continent"], "status": "fail"}
    send_to_server(message)


@socket_server.on('attack')
def attack(data):
    username = sidToUsername[request.sid]

    for room, player in lobby.items():  # check if the same room, get targetID
        if username in player.keys():
            for p in lobby[room]:
                if lobby[room][p]["continent"] == data["target"]:
                    targetID["targetID"] = lobby[room][p]["username"]
                    print("attacking: ", room, data["target"], targetID)

    # id = targetID.get("targetID", "_____")
    message = {"username": username, "action": "attack", "target": data["target"], "targetID": targetID, "allocated": data["allocated"], "currentRoomGameState": data["currentRoomGameState"]}
    send_to_server(message)


@socket_server.on('defend')
def defend(data):
    username = sidToUsername[request.sid]
    message = {"username": username, "action": "defend", "allocated": data["allocated"], "currentRoomGameState": data["currentRoomGameState"]}
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

