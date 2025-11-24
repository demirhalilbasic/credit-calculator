"""
Modeli podataka za kreditni kalkulator
"""
from pydantic import BaseModel, Field
from typing import Literal, Optional, List
from datetime import date


class CreditInput(BaseModel):
    """Model za unos parametara kredita"""
    amount: float = Field(..., gt=0, description="Iznos kredita")
    annual_interest_rate: float = Field(..., ge=0, le=100, description="Godišnja kamatna stopa (%)")
    term_months: int = Field(..., gt=0, description="Rok otplate u mjesecima")
    payment_type: Literal["annuity", "linear"] = Field(..., description="Tip otplate: anuitetni ili linearni")
    start_date: Optional[str] = Field(None, description="Datum početka otplate")


class PaymentScheduleItem(BaseModel):
    """Stavka otplatnog plana"""
    month: int = Field(..., description="Redni broj mjeseca")
    payment_date: str = Field(..., description="Datum plaćanja")
    monthly_payment: float = Field(..., description="Mjesečna rata")
    principal: float = Field(..., description="Iznos glavnice")
    interest: float = Field(..., description="Iznos kamate")
    remaining_balance: float = Field(..., description="Preostali dug")


class CreditSummary(BaseModel):
    """Sažetak kredita"""
    total_amount: float = Field(..., description="Ukupan iznos kredita")
    total_interest: float = Field(..., description="Ukupno plaćena kamata")
    total_cost: float = Field(..., description="Ukupni trošak (glavnica + kamata)")
    monthly_payment_avg: float = Field(..., description="Prosječna mjesečna rata")
    payment_type: str = Field(..., description="Tip otplate")


class CreditCalculationResult(BaseModel):
    """Rezultat izračuna kredita"""
    summary: CreditSummary
    schedule: List[PaymentScheduleItem]


class PrepaymentInput(BaseModel):
    """Model za prijevremenu otplatu"""
    amount: float = Field(..., gt=0, description="Iznos prijevremene otplate")
    month: int = Field(..., gt=0, description="Mjesec u kojem se vrši prijevremena otplata")
    type: Literal["partial", "full"] = Field(..., description="Tip: djelimična ili potpuna otplata")


class InterestRateChangeInput(BaseModel):
    """Model za promjenu kamatne stope"""
    rate_change: float = Field(..., description="Promjena kamatne stope (npr. 1 za +1%, -0.5 za -0.5%)")


class ComparisonInput(BaseModel):
    """Model za uporedbu više kredita"""
    credits: List[CreditInput] = Field(..., min_items=2, max_items=3, description="Lista kredita za uporedbu")
