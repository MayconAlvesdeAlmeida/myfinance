import psycopg2, os
from dotenv import load_dotenv
from psycopg2.extras import DictCursor


load_dotenv()

class DB:
    def __init__(self, params_db=None):
        self.conn = None
        self.params_db = params_db


    def get_connection(self):
        dbname = os.getenv('DB_NAME')
        user = os.getenv('DB_USER')
        password = os.getenv('DB_PASSWORD')
        host = os.getenv('DB_HOST')
        port = os.getenv('DB_PORT')

        try:
            if self.params_db:
                self.conn = psycopg2.connect(**self.params_db)
            else:
                self.conn = psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port)
            print("Conectado ao banco de dados")
        except Exception as e:
            print(f"Erro ao conectar no banco de dados: {e}")
            self.conn = None

        return self.conn


    def is_connected(self):
        # Verifica se a conexão está aberta
        if self.conn is not None and self.conn.closed == 0:
            print("Conexão está aberta")
            return True
     
        print("Conexão está fechada")
        return False


    def close_connection(self):
        # Fecha a conexão se estiver aberta
        if self.conn is not None and self.conn.closed == 0:
            self.conn.close()
            print("Conexão fechada com sucesso")
            return
 
        print("Conexão já estava fechada ou não foi estabelecida")


    