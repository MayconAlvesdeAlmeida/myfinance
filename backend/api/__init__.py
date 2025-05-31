from flask import Flask, request, make_response
from api.routes.healthcheck import healthcheck_bp
from api.routes.users import users_bp
from api.routes.costs import costs_bp
from api.routes.receivements import receivements_bp


app = Flask(__name__)

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add("Access-Control-Allow-Methods", "*")
        return response

app.register_blueprint(healthcheck_bp)
app.register_blueprint(users_bp)
app.register_blueprint(costs_bp)
app.register_blueprint(receivements_bp)