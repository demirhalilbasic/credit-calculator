"""
FastAPI backend aplikacija za kreditni kalkulator
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from datetime import datetime
from typing import List

from app.models.credit import (
    CreditInput, CreditCalculationResult, CreditSummary,
    PrepaymentInput, InterestRateChangeInput, ComparisonInput,
    PaymentScheduleItem
)
from app.services.credit_calculator import CreditCalculator
from app.services.pdf_generator import PDFGenerator


# Inicijalizacija FastAPI aplikacije
app = FastAPI(
    title="Kreditni Kalkulator API",
    description="REST API za izračun i analizu kredita",
    version="1.0.0"
)

# CORS konfiguracija za React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite i CRA portovi
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Kreditni Kalkulator API",
        "version": "1.0.0",
        "endpoints": [
            "/calculate",
            "/calculate/prepayment",
            "/calculate/rate-change",
            "/compare",
            "/export/pdf"
        ]
    }


@app.post("/calculate", response_model=CreditCalculationResult)
async def calculate_credit(credit: CreditInput):
    """
    Izračunaj kredit (anuitetni ili linearni model)
    """
    try:
        start_date = datetime.strptime(credit.start_date, "%Y-%m-%d") if credit.start_date else None
        
        if credit.payment_type == "annuity":
            schedule, summary = CreditCalculator.calculate_annuity(
                credit.amount,
                credit.annual_interest_rate,
                credit.term_months,
                start_date
            )
        else:
            schedule, summary = CreditCalculator.calculate_linear(
                credit.amount,
                credit.annual_interest_rate,
                credit.term_months,
                start_date
            )
        
        return CreditCalculationResult(
            summary=CreditSummary(**summary),
            schedule=[PaymentScheduleItem(**item) for item in schedule]
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/calculate/prepayment", response_model=CreditCalculationResult)
async def calculate_with_prepayment(data: dict):
    """
    Izračunaj kredit sa prijevremenom otplatom
    """
    try:
        credit = CreditInput(**data["credit"])
        prepayment = PrepaymentInput(**data["prepayment"])
        
        start_date = datetime.strptime(credit.start_date, "%Y-%m-%d") if credit.start_date else None
        
        schedule, summary = CreditCalculator.calculate_with_prepayment(
            credit.amount,
            credit.annual_interest_rate,
            credit.term_months,
            credit.payment_type,
            prepayment.amount,
            prepayment.month,
            start_date
        )
        
        return CreditCalculationResult(
            summary=CreditSummary(**summary),
            schedule=[PaymentScheduleItem(**item) for item in schedule]
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/calculate/rate-change", response_model=CreditCalculationResult)
async def calculate_rate_change(data: dict):
    """
    Simulacija promjene kamatne stope
    """
    try:
        credit = CreditInput(**data["credit"])
        rate_change = InterestRateChangeInput(**data["rate_change"])
        
        new_rate = credit.annual_interest_rate + rate_change.rate_change
        
        if new_rate < 0:
            raise ValueError("Kamatna stopa ne može biti negativna")
        
        # Kreiraj novi kredit sa izmijenjenom stopom
        modified_credit = credit.copy()
        modified_credit.annual_interest_rate = new_rate
        
        start_date = datetime.strptime(credit.start_date, "%Y-%m-%d") if credit.start_date else None
        
        if credit.payment_type == "annuity":
            schedule, summary = CreditCalculator.calculate_annuity(
                modified_credit.amount,
                modified_credit.annual_interest_rate,
                modified_credit.term_months,
                start_date
            )
        else:
            schedule, summary = CreditCalculator.calculate_linear(
                modified_credit.amount,
                modified_credit.annual_interest_rate,
                modified_credit.term_months,
                start_date
            )
        
        return CreditCalculationResult(
            summary=CreditSummary(**summary),
            schedule=[PaymentScheduleItem(**item) for item in schedule]
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/compare")
async def compare_credits(comparison: ComparisonInput):
    """
    Uporedi više kredita (2-3)
    """
    try:
        results = []
        
        for credit in comparison.credits:
            start_date = datetime.strptime(credit.start_date, "%Y-%m-%d") if credit.start_date else None
            
            if credit.payment_type == "annuity":
                schedule, summary = CreditCalculator.calculate_annuity(
                    credit.amount,
                    credit.annual_interest_rate,
                    credit.term_months,
                    start_date
                )
            else:
                schedule, summary = CreditCalculator.calculate_linear(
                    credit.amount,
                    credit.annual_interest_rate,
                    credit.term_months,
                    start_date
                )
            
            results.append({
                "input": credit.dict(),
                "summary": summary,
                "schedule": schedule
            })
        
        return {"comparisons": results}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/export/pdf")
async def export_pdf(credit: CreditInput):
    """
    Generiši PDF izvještaj
    """
    try:
        start_date = datetime.strptime(credit.start_date, "%Y-%m-%d") if credit.start_date else None
        
        if credit.payment_type == "annuity":
            schedule, summary = CreditCalculator.calculate_annuity(
                credit.amount,
                credit.annual_interest_rate,
                credit.term_months,
                start_date
            )
        else:
            schedule, summary = CreditCalculator.calculate_linear(
                credit.amount,
                credit.annual_interest_rate,
                credit.term_months,
                start_date
            )
        
        # Generiši PDF
        pdf_buffer = PDFGenerator.generate_credit_report(
            credit.dict(),
            schedule,
            summary
        )
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=kredit_izvjestaj_{datetime.now().strftime('%Y%m%d')}.pdf"
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/export/comparison-pdf")
async def export_comparison_pdf(comparison: ComparisonInput):
    """
    Generiši uporedni PDF izvještaj
    """
    try:
        results = []
        
        for credit in comparison.credits:
            start_date = datetime.strptime(credit.start_date, "%Y-%m-%d") if credit.start_date else None
            
            if credit.payment_type == "annuity":
                schedule, summary = CreditCalculator.calculate_annuity(
                    credit.amount,
                    credit.annual_interest_rate,
                    credit.term_months,
                    start_date
                )
            else:
                schedule, summary = CreditCalculator.calculate_linear(
                    credit.amount,
                    credit.annual_interest_rate,
                    credit.term_months,
                    start_date
                )
            
            results.append({
                "input": credit.dict(),
                "summary": summary
            })
        
        # Generiši uporedni PDF
        pdf_buffer = PDFGenerator.generate_comparison_report(results)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=uporedba_kredita_{datetime.now().strftime('%Y%m%d')}.pdf"
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
