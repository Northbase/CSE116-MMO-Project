
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
s.connect(('localhost', 8000))

delimiter = "~"


def listen_to_server(the_socket):
    buffer = ""
    while True:
        buffer += the_socket.recv(1024).decode()
        while delimiter in buffer:
            message = buffer[:buffer.find(delimiter)]
            buffer = buffer[buffer.find(delimiter) + 1:]
            get_from_server(message)


def get_from_server(data):
    socket_server.emit("test", data, broadcast=True)


Thread(target=listen_to_server, args=(s,)).start()


def send_to_server(data):
    s.sendall("hello".encode())


@socket_server.on('connect')
def got_message():
    print(request.sid + " connected")
    message = {"username": request.sid, "action": "connected"}
    send_to_server("hello")


@socket_server.on('disconnect')
def disconnect():
    print(request.sid + " disconnected")
    message = {"username": request.sid, "action": "disconnected"}
    send_to_scala("bye")


@app.route('/')
def index():
    return send_from_directory('../FrontEnd', 'index.html')


@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../FrontEnd', filename)


if __name__ == "__main__":
    socket_server.run(app, port=8080, debug="true")
    # app.run(port=8080, debug=True)

