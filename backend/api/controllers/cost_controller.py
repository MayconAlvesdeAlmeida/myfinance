from api.tools.db import DB
from psycopg2.extras import DictCursor
from datetime import date
from decimal import Decimal
from typing import Optional, Dict, List


class CostController:
    def __init__(self):
        self.db = DB()

    def create_cost(
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
                    INSERT INTO costs (user_id, title, description, value, transaction_date)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, title, description, value, transaction_date
                    """,
                    (user_id, title, description, value, transaction_date),
                )
                new_cost = cur.fetchone()
                conn.commit()

                return dict(new_cost)

        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                self.db.close_connection()

    def get_costs(
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
                    FROM costs
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
                costs = [dict(row) for row in cur.fetchall()]

                # Conta o total de registros para calcular a paginação
                count_query = """
                    SELECT COUNT(*)
                    FROM costs
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
                    "items": costs,
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

    def get_cost_by_id(self, user_id: int, cost_id: int) -> Optional[Dict]:
        try:
            conn = self.db.get_connection()
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute(
                    """
                    SELECT id, title, description, value, transaction_date
                    FROM costs
                    WHERE id = %s AND user_id = %s
                    """,
                    (cost_id, user_id)
                )
                cost = cur.fetchone()
                
                if not cost:
                    return None

                return dict(cost)

        except Exception as e:
            raise e
        finally:
            if conn:
                self.db.close_connection() 