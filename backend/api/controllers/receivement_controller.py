from api.tools.db import DB
from psycopg2.extras import DictCursor
from datetime import date
from decimal import Decimal
from typing import Optional, Dict, List


class ReceivementController:
    def __init__(self):
        self.db = DB()

    def create_receivement(
        self,
        user_id: int,
        title: str,
        description: str | None,
        value: Decimal,
        transaction_date: date,
    ) -> dict:
        try:
            conn = self.db.get_connection()
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute(
                    """
                    INSERT INTO receivements (user_id, title, description, value, transaction_date)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, title, description, value, transaction_date
                    """,
                    (user_id, title, description, value, transaction_date),
                )
                new_receivement = cur.fetchone()
                conn.commit()

                return dict(new_receivement)

        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                self.db.close_connection()

    def get_receivements(
        self,
        user_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Dict[str, any]:
        try:
            conn = self.db.get_connection()
            with conn.cursor(cursor_factory=DictCursor) as cur:
                # Monta a query base
                query = """
                    SELECT id, title, description, value, transaction_date
                    FROM receivements
                    WHERE user_id = %s
                """
                params = [user_id]

                # Adiciona filtros de data se fornecidos
                if start_date:
                    query += " AND transaction_date >= %s"
                    params.append(start_date)
                if end_date:
                    query += " AND transaction_date <= %s"
                    params.append(end_date)

                # Adiciona ordenação e paginação
                query += """
                    ORDER BY transaction_date DESC
                    LIMIT %s OFFSET %s
                """
                offset = (page - 1) * page_size
                params.extend([page_size, offset])

                # Executa a query principal
                cur.execute(query, params)
                receivements = [dict(row) for row in cur.fetchall()]

                # Conta o total de registros para calcular a paginação
                count_query = """
                    SELECT COUNT(*)
                    FROM receivements
                    WHERE user_id = %s
                """
                count_params = [user_id]

                if start_date:
                    count_query += " AND transaction_date >= %s"
                    count_params.append(start_date)
                if end_date:
                    count_query += " AND transaction_date <= %s"
                    count_params.append(end_date)

                cur.execute(count_query, count_params)
                total_items = cur.fetchone()[0]
                total_pages = (total_items + page_size - 1) // page_size

                return {
                    "items": receivements,
                    "pagination": {
                        "page": page,
                        "page_size": page_size,
                        "total_items": total_items,
                        "total_pages": total_pages
                    }
                }

        except Exception as e:
            raise e
        finally:
            if conn:
                self.db.close_connection()

    def get_receivement_by_id(self, user_id: int, receivement_id: int) -> Optional[Dict]:
        try:
            conn = self.db.get_connection()
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute(
                    """
                    SELECT id, title, description, value, transaction_date
                    FROM receivements
                    WHERE id = %s AND user_id = %s
                    """,
                    (receivement_id, user_id)
                )
                receivement = cur.fetchone()
                
                if not receivement:
                    return None

                return dict(receivement)

        except Exception as e:
            raise e
        finally:
            if conn:
                self.db.close_connection()

    def update_receivement(
        self,
        user_id: int,
        receivement_id: int,
        title: str,
        description: Optional[str],
        value: Decimal,
        transaction_date: date,
    ) -> Optional[Dict]:
        try:
            conn = self.db.get_connection()
            with conn.cursor(cursor_factory=DictCursor) as cur:
                # Verifica se o recebimento existe e pertence ao usuário
                cur.execute(
                    "SELECT id FROM receivements WHERE id = %s AND user_id = %s",
                    (receivement_id, user_id)
                )
                if not cur.fetchone():
                    return None

                # Atualiza o recebimento
                cur.execute(
                    """
                    UPDATE receivements
                    SET title = %s,
                        description = %s,
                        value = %s,
                        transaction_date = %s
                    WHERE id = %s AND user_id = %s
                    RETURNING id, title, description, value, transaction_date
                    """,
                    (title, description, value, transaction_date, receivement_id, user_id)
                )
                updated_receivement = cur.fetchone()
                conn.commit()

                return dict(updated_receivement)

        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                self.db.close_connection()

    def patch_receivement(
        self,
        user_id: int,
        receivement_id: int,
        updates: Dict
    ) -> Optional[Dict]:
        try:
            conn = self.db.get_connection()
            with conn.cursor(cursor_factory=DictCursor) as cur:
                # Verifica se o recebimento existe e pertence ao usuário
                cur.execute(
                    "SELECT * FROM receivements WHERE id = %s AND user_id = %s",
                    (receivement_id, user_id)
                )
                current_receivement = cur.fetchone()
                if not current_receivement:
                    return None

                # Monta a query de atualização dinamicamente
                update_fields = []
                params = []
                for key, value in updates.items():
                    if value is not None:
                        update_fields.append(f"{key} = %s")
                        params.append(value)

                if not update_fields:
                    return dict(current_receivement)

                # Adiciona os parâmetros restantes
                params.extend([receivement_id, user_id])

                # Executa a atualização
                query = f"""
                    UPDATE receivements
                    SET {", ".join(update_fields)}
                    WHERE id = %s AND user_id = %s
                    RETURNING id, title, description, value, transaction_date
                """
                cur.execute(query, params)
                updated_receivement = cur.fetchone()
                conn.commit()

                return dict(updated_receivement)

        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                self.db.close_connection()

    def delete_receivement(self, user_id: int, receivement_id: int) -> bool:
        try:
            conn = self.db.get_connection()
            with conn.cursor() as cur:
                # Verifica se o recebimento existe e pertence ao usuário
                cur.execute(
                    "SELECT id FROM receivements WHERE id = %s AND user_id = %s",
                    (receivement_id, user_id)
                )
                if not cur.fetchone():
                    return False

                # Remove o recebimento
                cur.execute(
                    "DELETE FROM receivements WHERE id = %s AND user_id = %s",
                    (receivement_id, user_id)
                )
                conn.commit()
                return True

        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                self.db.close_connection() 