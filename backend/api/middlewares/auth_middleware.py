from functools import wraps
from flask import request, jsonify
from api.tools.token import validate_token


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({"error": "Token de acesso não fornecido"}), 401
        
        try:
            # Verifica se o header começa com "Bearer "
            if not auth_header.startswith('Bearer '):
                return jsonify({"error": "Formato de token inválido"}), 401
            
            # Extrai o token
            token = auth_header.split(' ')[1]
            
            # Valida o token
            payload = validate_token(token)
            if not payload:
                return jsonify({"error": "Token inválido ou expirado"}), 401
            
            # Adiciona as informações do usuário ao request
            request.user = payload
            
            return f(*args, **kwargs)
            
        except Exception as e:
            return jsonify({"error": "Erro ao validar token"}), 401
            
    return decorated 