from api.tools.db import DB
from api.tools.password import hash_password, check_password
from api.tools.token import generate_token
from psycopg2.extras import DictCursor


class UserController:
    def __init__(self):
        self.db = DB()

    def create_user(self, name: str, email: str, password: str) -> dict:
        try:
            # Criptografa a senha usando a função do módulo password
            hashed_password = hash_password(password)

            conn = self.db.get_connection()
            with conn.cursor(cursor_factory=DictCursor) as cur:
                # Verifica se o email já existe
                cur.execute("SELECT id FROM users WHERE email = %s", (email,))
                if cur.fetchone():
                    raise ValueError("Email já cadastrado")

                # Insere o novo usuário
                cur.execute(
                    "INSERT INTO users (name, email, password) VALUES (%s, %s, %s) RETURNING id, name, email",
                    (name, email, hashed_password),
                )
                new_user = cur.fetchone()
                conn.commit()

                return dict(new_user)

        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                self.db.close_connection()

    def login(self, email: str, password: str) -> dict:
        try:
            conn = self.db.get_connection()
            with conn.cursor(cursor_factory=DictCursor) as cur:
                # Busca o usuário pelo email
                cur.execute(
                    "SELECT id, name, email, password FROM users WHERE email = %s",
                    (email,),
                )
                user = cur.fetchone()

                if not user:
                    raise ValueError("Email ou senha inválidos")

                # Verifica se a senha está correta
                if not check_password(password, user["password"]):
                    raise ValueError("Email ou senha inválidos")

                # Gera o token de acesso
                user_info = {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                }
                token = generate_token(user_info)

                return {"access_token": token}

        except Exception as e:
            raise e
        finally:
            if conn:
                self.db.close_connection()
