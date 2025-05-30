from flask import Blueprint, request, jsonify, url_for
from api.controllers.cost_controller import CostController
from api.dtos.cost_dto import CreateCostDTO, GetCostsDTO
from api.middlewares.auth_middleware import require_auth
from pydantic import ValidationError
from datetime import datetime

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


@costs_bp.route("/costs", methods=["GET"])
@require_auth
def get_costs():
    try:
        # Converte as datas de string para date
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        params = {
            "page": request.args.get("page", 1, type=int),
            "page_size": request.args.get("page_size", 20, type=int),
        }

        if start_date:
            params["start_date"] = datetime.strptime(start_date, "%Y-%m-%d").date()
        if end_date:
            params["end_date"] = datetime.strptime(end_date, "%Y-%m-%d").date()

        # Valida os parâmetros usando o DTO
        query_params = GetCostsDTO(**params)
        query_params.validate_dates()

        # Busca os gastos
        result = cost_controller.get_costs(
            user_id=request.user["id"],
            start_date=query_params.start_date,
            end_date=query_params.end_date,
            page=query_params.page,
            page_size=query_params.page_size,
        )

        # Adiciona links de paginação
        base_url = request.base_url
        pagination = result["pagination"]
        current_page = pagination["page"]
        total_pages = pagination["total_pages"]

        links = {}

        # Link para primeira página
        links["first"] = f"{base_url}?page=1"

        # Link para próxima página
        if current_page < total_pages:
            links["next"] = f"{base_url}?page={current_page + 1}"

        # Link para última página
        links["last"] = f"{base_url}?page={total_pages}"

        # Adiciona os parâmetros de data aos links se existirem
        for key in links:
            if start_date:
                links[key] += f"&start_date={start_date}"
            if end_date:
                links[key] += f"&end_date={end_date}"
            links[key] += f"&page_size={pagination['page_size']}"

        result["links"] = links

        return jsonify(result), 200

    except ValidationError as e:
        return jsonify({"error": "Dados inválidos", "details": e.errors()}), 400
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno do servidor"}), 500
