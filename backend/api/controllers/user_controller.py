from api.tools.db import DB
from api.tools.password import hash_password
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
                    (name, email, hashed_password)
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