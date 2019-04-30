import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('localhost', 8000))

s.send("HELLO".encode())
data = s.recv(1024)
s.close()

print("recieved:", data)