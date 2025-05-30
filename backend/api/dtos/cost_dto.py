from pydantic import BaseModel, Field
from datetime import date
from decimal import Decimal
from typing import Optional


class CreateCostDTO(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    value: Decimal = Field(..., gt=0, decimal_places=2)
    transaction_date: date = Field(default_factory=date.today) 