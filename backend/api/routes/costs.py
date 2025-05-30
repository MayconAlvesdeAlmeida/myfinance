from flask import Blueprint, request, jsonify
from api.controllers.cost_controller import CostController
from api.dtos.cost_dto import CreateCostDTO
from api.middlewares.auth_middleware import require_auth
from pydantic import ValidationError

costs_bp = Blueprint("costs", __name__)
cost_controller = CostController()


@costs_bp.route("/costs", methods=["POST"])
@require_auth
def create_cost():
    try:
        data = request.get_json()
        # Valida os dados recebidos usando o DTO
        cost_data = CreateCostDTO(**data)

        # Cria o gasto
        new_cost = cost_controller.create_cost(
            user_id=request.user["id"],
            title=cost_data.title,
            description=cost_data.description,
            value=cost_data.value,
            transaction_date=cost_data.transaction_date,
        )

        return jsonify(new_cost), 201

    except ValidationError as e:
        return jsonify({"error": "Dados inválidos", "details": e.errors()}), 400
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno do servidor"}), 500
