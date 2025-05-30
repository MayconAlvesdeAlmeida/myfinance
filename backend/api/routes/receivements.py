from flask import Blueprint, request, jsonify, url_for
from api.controllers.receivement_controller import ReceivementController
from api.dtos.receivement_dto import (
    CreateReceivementDTO,
    GetReceivementsDTO,
    UpdateReceivementDTO,
    PatchReceivementDTO,
)
from api.middlewares.auth_middleware import require_auth
from pydantic import ValidationError
from datetime import datetime

receivements_bp = Blueprint("receivements", __name__)
receivement_controller = ReceivementController()


@receivements_bp.route("/receivements", methods=["POST"])
@require_auth
def create_receivement():
    try:
        data = request.get_json()
        # Valida os dados recebidos usando o DTO
        receivement_data = CreateReceivementDTO(**data)
        
        # Cria o recebimento
        new_receivement = receivement_controller.create_receivement(
            user_id=request.user["id"],
            title=receivement_data.title,
            description=receivement_data.description,
            value=receivement_data.value,
            transaction_date=receivement_data.transaction_date,
        )
        
        return jsonify(new_receivement), 201

    except ValidationError as e:
        return jsonify({"error": "Dados inválidos", "details": e.errors()}), 400
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno do servidor"}), 500


@receivements_bp.route("/receivements", methods=["GET"])
@require_auth
def get_receivements():
    try:
        # Converte as datas de string para date
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        params = {
            'page': request.args.get('page', 1, type=int),
            'page_size': request.args.get('page_size', 20, type=int)
        }
        
        if start_date:
            params['start_date'] = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            params['end_date'] = datetime.strptime(end_date, '%Y-%m-%d').date()
        
        # Valida os parâmetros usando o DTO
        query_params = GetReceivementsDTO(**params)
        query_params.validate_dates()
        
        # Busca os recebimentos
        result = receivement_controller.get_receivements(
            user_id=request.user["id"],
            start_date=query_params.start_date,
            end_date=query_params.end_date,
            page=query_params.page,
            page_size=query_params.page_size
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


@receivements_bp.route("/receivements/<int:receivement_id>", methods=["GET"])
@require_auth
def get_receivement_by_id(receivement_id):
    try:
        # Busca o recebimento específico
        receivement = receivement_controller.get_receivement_by_id(
            user_id=request.user["id"], receivement_id=receivement_id
        )
        
        if not receivement:
            return jsonify({"error": "Recebimento não encontrado"}), 404
            
        return jsonify(receivement), 200

    except Exception as e:
        return jsonify({"error": "Erro interno do servidor"}), 500


@receivements_bp.route("/receivements/<int:receivement_id>", methods=["PUT"])
@require_auth
def update_receivement(receivement_id):
    try:
        data = request.get_json()
        # Valida os dados recebidos usando o DTO
        receivement_data = UpdateReceivementDTO(**data)
        
        # Atualiza o recebimento
        updated_receivement = receivement_controller.update_receivement(
            user_id=request.user["id"],
            receivement_id=receivement_id,
            title=receivement_data.title,
            description=receivement_data.description,
            value=receivement_data.value,
            transaction_date=receivement_data.transaction_date,
        )
        
        if not updated_receivement:
            return jsonify({"error": "Recebimento não encontrado"}), 404
            
        return jsonify(updated_receivement), 200

    except ValidationError as e:
        return jsonify({"error": "Dados inválidos", "details": e.errors()}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno do servidor"}), 500


@receivements_bp.route("/receivements/<int:receivement_id>", methods=["PATCH"])
@require_auth
def patch_receivement(receivement_id):
    try:
        data = request.get_json()
        # Valida os dados recebidos usando o DTO
        receivement_data = PatchReceivementDTO(**data)
        
        # Filtra apenas os campos que foram fornecidos
        updates = {k: v for k, v in receivement_data.dict().items() if v is not None}
        
        # Atualiza o recebimento
        updated_receivement = receivement_controller.patch_receivement(
            user_id=request.user["id"], receivement_id=receivement_id, updates=updates
        )
        
        if not updated_receivement:
            return jsonify({"error": "Recebimento não encontrado"}), 404
            
        return jsonify(updated_receivement), 200

    except ValidationError as e:
        return jsonify({"error": "Dados inválidos", "details": e.errors()}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno do servidor"}), 500


@receivements_bp.route("/receivements/<int:receivement_id>", methods=["DELETE"])
@require_auth
def delete_receivement(receivement_id):
    try:
        # Remove o recebimento
        success = receivement_controller.delete_receivement(
            user_id=request.user["id"], receivement_id=receivement_id
        )
        
        if not success:
            return jsonify({"error": "Recebimento não encontrado"}), 404
            
        return "", 204

    except Exception as e:
        return jsonify({"error": "Erro interno do servidor"}), 500