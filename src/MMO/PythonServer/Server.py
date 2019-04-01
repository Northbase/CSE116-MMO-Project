from bottle import route, run, request, Bottle
import Cloud

#

app = Bottle()

@route("/")
def root():
    return "Hello World"


@route('/write')
def write():
    Cloud.write(request.json)


@route('/<continent>')
def read(continent):
    return Cloud.read(continent)



run(app, host="localhost", port=8080)
