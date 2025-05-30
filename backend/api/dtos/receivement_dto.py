from pydantic import BaseModel, Field
from datetime import date
from decimal import Decimal
from typing import Optional


class CreateReceivementDTO(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    value: Decimal = Field(..., gt=0, decimal_places=2)
    transaction_date: date = Field(default_factory=date.today)


class GetReceivementsDTO(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

    def validate_dates(self):
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValueError("Data inicial não pode ser maior que a data final")


class UpdateReceivementDTO(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    value: Decimal = Field(..., gt=0, decimal_places=2)
    transaction_date: date


class PatchReceivementDTO(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    value: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    transaction_date: Optional[date] = None 