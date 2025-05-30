from api.tools.db import DB
from psycopg2.extras import DictCursor
from datetime import date
from decimal import Decimal


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