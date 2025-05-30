from flask import Flask
from api.routes.healthcheck import healthcheck_bp
from api.routes.users import users_bp


app = Flask(__name__)

app.register_blueprint(healthcheck_bp, url_prefix="/api")
app.register_blueprint(users_bp, url_prefix="/api")
