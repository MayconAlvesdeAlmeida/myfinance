from flask import Blueprint, request, jsonify
from api.controllers.user_controller import UserController
from api.dtos.user_dto import CreateUserDTO
from pydantic import ValidationError

users_bp = Blueprint("users", __name__)
user_controller = UserController()


@users_bp.route("/users", methods=["POST"])
def create_user():
    try:
        data = request.get_json()
        # Valida os dados recebidos usando o DTO
        user_data = CreateUserDTO(**data)

        # Cria o usuário
        new_user = user_controller.create_user(
            name=user_data.name, email=user_data.email, password=user_data.password
        )

        return jsonify(new_user), 201

    except ValidationError as e:
        return jsonify({"error": "Dados inválidos", "details": e.errors()}), 400
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno do servidor"}), 500
