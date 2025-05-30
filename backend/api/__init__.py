from flask import Flask
from backend.api.routes.healthcheck import healthcheck_bp

app = Flask(__name__)

app.register_blueprint(healthcheck_bp, url_prefix='/api')