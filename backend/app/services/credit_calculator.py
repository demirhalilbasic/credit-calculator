"""
Servis za izračun kredita - anuitetni i linearni model
"""
from datetime import datetime, timedelta
from typing import List, Tuple
import math


class CreditCalculator:
    """Klasa za izračun različitih tipova kredita"""
    
    @staticmethod
    def calculate_annuity(
        amount: float,
        annual_rate: float,
        term_months: int,
        start_date: datetime = None
    ) -> Tuple[List[dict], dict]:
        """
        Izračun anuitetnog kredita (fiksna rata)
        
        Formula:
        A = P * [r(1+r)^n] / [(1+r)^n - 1]
        gdje je:
        A = mjesečna rata
        P = iznos kredita
        r = mjesečna kamatna stopa
        n = broj mjeseci
        """
        if start_date is None:
            start_date = datetime.now()
        
        # Konverzija godišnje u mjesečnu kamatnu stopu
        monthly_rate = (annual_rate / 100) / 12
        
        # Izračun mjesečne rate (anuitet)
        if monthly_rate == 0:
            monthly_payment = amount / term_months
        else:
            monthly_payment = amount * (
                monthly_rate * math.pow(1 + monthly_rate, term_months)
            ) / (math.pow(1 + monthly_rate, term_months) - 1)
        
        schedule = []
        remaining_balance = amount
        total_interest = 0
        total_principal = 0
        
        for month in range(1, term_months + 1):
            # Izračun kamate za tekući mjesec
            interest = remaining_balance * monthly_rate
            
            # Iznos glavnice
            principal = monthly_payment - interest
            
            # Ažuriranje preostalog duga
            remaining_balance -= principal
            
            # Zaokruživanje na posljednji mjesec zbog zaokruživanja
            if month == term_months:
                principal += remaining_balance
                remaining_balance = 0
            
            total_interest += interest
            total_principal += principal
            
            payment_date = start_date + timedelta(days=30 * month)
            
            schedule.append({
                "month": month,
                "payment_date": payment_date.strftime("%Y-%m-%d"),
                "monthly_payment": round(monthly_payment, 2),
                "principal": round(principal, 2),
                "interest": round(interest, 2),
                "remaining_balance": round(max(0, remaining_balance), 2)
            })
        
        summary = {
            "total_amount": round(amount, 2),
            "total_interest": round(total_interest, 2),
            "total_cost": round(amount + total_interest, 2),
            "monthly_payment_avg": round(monthly_payment, 2),
            "payment_type": "Anuitetni"
        }
        
        return schedule, summary
    
    @staticmethod
    def calculate_linear(
        amount: float,
        annual_rate: float,
        term_months: int,
        start_date: datetime = None
    ) -> Tuple[List[dict], dict]:
        """
        Izračun linearnog kredita (opadajuća rata)
        
        Glavnica se dijeli na jednake dijelove, kamata se obračunava na preostali dug
        """
        if start_date is None:
            start_date = datetime.now()
        
        # Konverzija godišnje u mjesečnu kamatnu stopu
        monthly_rate = (annual_rate / 100) / 12
        
        # Fiksni dio glavnice
        principal_payment = amount / term_months
        
        schedule = []
        remaining_balance = amount
        total_interest = 0
        total_payments = 0
        
        for month in range(1, term_months + 1):
            # Izračun kamate za tekući mjesec
            interest = remaining_balance * monthly_rate
            
            # Ukupna rata = glavnica + kamata
            monthly_payment = principal_payment + interest
            
            total_interest += interest
            total_payments += monthly_payment
            
            # Ažuriranje preostalog duga
            remaining_balance -= principal_payment
            
            payment_date = start_date + timedelta(days=30 * month)
            
            schedule.append({
                "month": month,
                "payment_date": payment_date.strftime("%Y-%m-%d"),
                "monthly_payment": round(monthly_payment, 2),
                "principal": round(principal_payment, 2),
                "interest": round(interest, 2),
                "remaining_balance": round(max(0, remaining_balance), 2)
            })
        
        summary = {
            "total_amount": round(amount, 2),
            "total_interest": round(total_interest, 2),
            "total_cost": round(amount + total_interest, 2),
            "monthly_payment_avg": round(total_payments / term_months, 2),
            "payment_type": "Linearni"
        }
        
        return schedule, summary
    
    @staticmethod
    def calculate_with_prepayment(
        amount: float,
        annual_rate: float,
        term_months: int,
        payment_type: str,
        prepayment_amount: float,
        prepayment_month: int,
        start_date: datetime = None
    ) -> Tuple[List[dict], dict]:
        """
        Izračun kredita sa prijevremenom otplatom
        """
        if start_date is None:
            start_date = datetime.now()
        
        # Prvo generiši redovni plan
        if payment_type == "annuity":
            schedule, _ = CreditCalculator.calculate_annuity(amount, annual_rate, term_months, start_date)
        else:
            schedule, _ = CreditCalculator.calculate_linear(amount, annual_rate, term_months, start_date)
        
        # Primijeni prijevremenu otplatu
        if prepayment_month <= len(schedule):
            remaining_at_prepayment = schedule[prepayment_month - 1]["remaining_balance"]
            
            if prepayment_amount >= remaining_at_prepayment:
                # Potpuna otplata
                schedule = schedule[:prepayment_month]
                schedule[-1]["remaining_balance"] = 0
                new_term = prepayment_month
            else:
                # Djelimična otplata - smanji preostali dug i preračunaj
                new_amount = remaining_at_prepayment - prepayment_amount
                remaining_months = term_months - prepayment_month
                
                # Dodaj informaciju o prijevremnoj otplati
                schedule[prepayment_month - 1]["prepayment"] = prepayment_amount
                schedule[prepayment_month - 1]["remaining_balance"] -= prepayment_amount
                
                # Preračunaj preostale rate
                if payment_type == "annuity":
                    new_schedule, _ = CreditCalculator.calculate_annuity(
                        new_amount, annual_rate, remaining_months,
                        start_date + timedelta(days=30 * prepayment_month)
                    )
                else:
                    new_schedule, _ = CreditCalculator.calculate_linear(
                        new_amount, annual_rate, remaining_months,
                        start_date + timedelta(days=30 * prepayment_month)
                    )
                
                # Ažuriraj mjesečne brojeve
                for item in new_schedule:
                    item["month"] += prepayment_month
                
                # Kombiniraj raspored
                schedule = schedule[:prepayment_month] + new_schedule
                new_term = len(schedule)
        
        # Izračunaj novi sažetak
        total_payment = sum(item["monthly_payment"] for item in schedule)
        total_interest = sum(item["interest"] for item in schedule)
        
        summary = {
            "total_amount": round(amount, 2),
            "total_interest": round(total_interest, 2),
            "total_cost": round(total_payment, 2),
            "monthly_payment_avg": round(total_payment / len(schedule), 2),
            "payment_type": "Anuitetni" if payment_type == "annuity" else "Linearni",
            "prepayment_savings": round(amount + sum(item["interest"] for item in 
                (CreditCalculator.calculate_annuity(amount, annual_rate, term_months, start_date)[0] 
                 if payment_type == "annuity" else 
                 CreditCalculator.calculate_linear(amount, annual_rate, term_months, start_date)[0])) - total_payment, 2)
        }
        
        return schedule, summary
