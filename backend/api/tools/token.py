import jwt, datetime, os
from dotenv import load_dotenv
from typing import Union

load_dotenv()


def generate_token(user_info: dict, expiration_time: int = 3600) -> str:
    exp = datetime.datetime.utcnow() + datetime.timedelta(seconds=expiration_time)
    user_info['exp'] = exp

    return jwt.encode(user_info, os.getenv('SECRET_KEY'), algorithm='HS256')


def validate_token(token: str) -> Union[dict, None]:
    try:
        decoded_payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        print(f'Dados decodificados: {decoded_payload}')
        return decoded_payload
    except jwt.ExpiredSignatureError:
        print('O token expirou!')
    except jwt.InvalidTokenError:
        print('Token inválido!')
    except Exception as e:
        print(f'Erro ao decodificar o token: {e}')
    return None
