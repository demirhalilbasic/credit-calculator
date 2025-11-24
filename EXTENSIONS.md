# Proširenja i dodatne funkcionalnosti

## 🎯 Implementirane funkcionalnosti

### ✅ Osnovne funkcionalnosti

- [x] Unos parametara kredita (iznos, kamata, rok)
- [x] Anuitetni model izračuna
- [x] Linearni model izračuna
- [x] Automatsko generisanje otplatnog plana
- [x] Prikaz ukupne otplate

### ✅ Vizualizacije

- [x] Graf preostalog duga kroz vrijeme (linijski)
- [x] Graf odnosa kamate i glavnice (stacked bar)
- [x] Graf ukupne distribucije troškova (doughnut)

### ✅ Napredne funkcionalnosti

- [x] Prijevremena otplata (djelimična + potpuna)
- [x] Simulacija promjene kamatne stope (+/- %)
- [x] Uporedni kalkulator za 2-3 kredita
- [x] PDF sažetak (tabela + statistika)
- [x] CSV export otplatnog plana

## 🚀 Predložena proširenja

### 1. Autentifikacija i korisnički nalozi

**Backend implementacija:**

```python
# backend/app/models/user.py
from pydantic import BaseModel, EmailStr

class User(BaseModel):
    id: int
    email: EmailStr
    full_name: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

# backend/app/services/auth.py
from passlib.context import CryptContext
from jose import JWTError, jwt

class AuthService:
    pwd_context = CryptContext(schemes=["bcrypt"])

    @staticmethod
    def verify_password(plain_password, hashed_password):
        return AuthService.pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password):
        return AuthService.pwd_context.hash(password)

    @staticmethod
    def create_access_token(data: dict):
        # JWT token generation
        pass
```

**Frontend implementacija:**

```javascript
// frontend/src/components/Auth/Login.jsx
const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    // API call za login
    const token = await authAPI.login(credentials);
    localStorage.setItem('token', token);
  };

  return (
    // Login forma
  );
};
```

**Zavisnosti:**

```
Backend: python-jose[cryptography], passlib[bcrypt], python-multipart
Frontend: react-router-dom za protected routes
```

---

### 2. Baza podataka - čuvanje kredita

**Backend - SQLAlchemy models:**

```python
# backend/app/models/database.py
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class SavedCredit(Base):
    __tablename__ = "saved_credits"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    amount = Column(Float)
    annual_interest_rate = Column(Float)
    term_months = Column(Integer)
    payment_type = Column(String)
    created_at = Column(DateTime)

class CreditHistory(Base):
    __tablename__ = "credit_history"

    id = Column(Integer, primary_key=True)
    credit_id = Column(Integer, ForeignKey("saved_credits.id"))
    calculation_date = Column(DateTime)
    summary_json = Column(String)  # JSON sa rezultatima
```

**API Endpoints:**

```python
@app.post("/credits/save")
async def save_credit(credit: CreditInput, user_id: int):
    # Sačuvaj kredit u bazu
    pass

@app.get("/credits/my-credits")
async def get_my_credits(user_id: int):
    # Vrati sve kredite korisnika
    pass

@app.get("/credits/{credit_id}")
async def get_credit(credit_id: int):
    # Vrati specifičan kredit
    pass

@app.delete("/credits/{credit_id}")
async def delete_credit(credit_id: int):
    # Obriši kredit
    pass
```

**Frontend - Lista sačuvanih kredita:**

```javascript
const SavedCredits = () => {
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    const data = await creditAPI.getMySavedCredits();
    setCredits(data);
  };

  return (
    <div>
      {credits.map((credit) => (
        <CreditCard
          key={credit.id}
          credit={credit}
          onLoad={() => loadCredit(credit.id)}
          onDelete={() => deleteCredit(credit.id)}
        />
      ))}
    </div>
  );
};
```

---

### 3. Notifikacije i email izvještaji

**Backend - Email servis:**

```python
# backend/app/services/email_service.py
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

class EmailService:
    conf = ConnectionConfig(
        MAIL_USERNAME="your@email.com",
        MAIL_PASSWORD="password",
        MAIL_FROM="noreply@creditcalc.com",
        MAIL_PORT=587,
        MAIL_SERVER="smtp.gmail.com",
        MAIL_TLS=True,
        MAIL_SSL=False
    )

    @staticmethod
    async def send_credit_report(email: str, pdf_buffer):
        message = MessageSchema(
            subject="Vaš kreditni izvještaj",
            recipients=[email],
            body="U prilogu se nalazi vaš kreditni izvještaj.",
            attachments=[pdf_buffer]
        )

        fm = FastMail(EmailService.conf)
        await fm.send_message(message)

# Endpoint
@app.post("/credits/email-report")
async def email_report(email: EmailStr, credit: CreditInput):
    # Generiši PDF
    pdf = PDFGenerator.generate_credit_report(...)

    # Pošalji email
    await EmailService.send_credit_report(email, pdf)

    return {"message": "Email sent successfully"}
```

---

### 4. Grafički prikazi dodatnih metrika

**Nove vizualizacije:**

```javascript
// 1. Amortizaciona kriva (cumulative principal paid)
const AmortizationCurve = ({ schedule }) => {
  const cumulativePrincipal = schedule.map((item, index) =>
    schedule.slice(0, index + 1).reduce((sum, s) => sum + s.principal, 0)
  );

  const data = {
    labels: schedule.map((s) => `Mj ${s.month}`),
    datasets: [
      {
        label: "Kumulativna plaćena glavnica",
        data: cumulativePrincipal,
        fill: true,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
      },
    ],
  };

  return <Line data={data} />;
};

// 2. Heatmap kamata po godinama
const InterestHeatmap = ({ schedule }) => {
  // Grupiši po godinama
  const yearlyInterest = groupByYear(schedule);

  return (
    <Bar
      data={{
        labels: Object.keys(yearlyInterest),
        datasets: [
          {
            label: "Godišnja kamata",
            data: Object.values(yearlyInterest),
            backgroundColor: "rgba(249, 115, 22, 0.8)",
          },
        ],
      }}
    />
  );
};

// 3. Procenat otplaćene glavnice
const PrincipalProgressGauge = ({ schedule, currentMonth }) => {
  const totalPrincipal = schedule[0].remaining_balance + schedule[0].principal;
  const paidPrincipal = schedule
    .slice(0, currentMonth)
    .reduce((sum, s) => sum + s.principal, 0);

  const percentage = (paidPrincipal / totalPrincipal) * 100;

  return (
    <Doughnut
      data={{
        labels: ["Plaćeno", "Preostalo"],
        datasets: [
          {
            data: [percentage, 100 - percentage],
            backgroundColor: ["#22c55e", "#e5e7eb"],
          },
        ],
      }}
    />
  );
};
```

---

### 5. Exportovanje u Excel

**Backend:**

```python
# requirements.txt
openpyxl==3.1.2

# backend/app/services/excel_generator.py
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from io import BytesIO

class ExcelGenerator:
    @staticmethod
    def generate_credit_report(credit_data, schedule, summary):
        wb = Workbook()
        ws = wb.active
        ws.title = "Otplatni Plan"

        # Header
        ws['A1'] = 'Kreditni Kalkulator - Izvještaj'
        ws['A1'].font = Font(size=16, bold=True)

        # Summary
        ws['A3'] = 'Iznos kredita:'
        ws['B3'] = summary['total_amount']
        ws['A4'] = 'Ukupna kamata:'
        ws['B4'] = summary['total_interest']

        # Otplatni plan
        ws['A7'] = 'Mjesec'
        ws['B7'] = 'Datum'
        ws['C7'] = 'Rata (KM)'
        ws['D7'] = 'Glavnica'
        ws['E7'] = 'Kamata'
        ws['F7'] = 'Preostali dug'

        for idx, item in enumerate(schedule, start=8):
            ws[f'A{idx}'] = item['month']
            ws[f'B{idx}'] = item['payment_date']
            ws[f'C{idx}'] = item['monthly_payment']
            ws[f'D{idx}'] = item['principal']
            ws[f'E{idx}'] = item['interest']
            ws[f'F{idx}'] = item['remaining_balance']

        buffer = BytesIO()
        wb.save(buffer)
        buffer.seek(0)
        return buffer

# Endpoint
@app.post("/export/excel")
async def export_excel(credit: CreditInput):
    schedule, summary = calculate_credit(credit)
    excel = ExcelGenerator.generate_credit_report(
        credit.dict(), schedule, summary
    )

    return StreamingResponse(
        excel,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=kredit.xlsx"}
    )
```

---

### 6. Kalkulatori za specifične scenarije

**a) Refinansiranje kredita:**

```python
# backend/app/services/refinancing_calculator.py
class RefinancingCalculator:
    @staticmethod
    def calculate_refinancing_benefit(
        current_credit: dict,
        new_credit: dict,
        months_paid: int
    ):
        # Izračunaj preostali dug
        current_schedule, _ = CreditCalculator.calculate_annuity(...)
        remaining_balance = current_schedule[months_paid]['remaining_balance']

        # Izračunaj novi kredit sa tim iznosom
        new_schedule, new_summary = CreditCalculator.calculate_annuity(
            remaining_balance,
            new_credit['annual_interest_rate'],
            new_credit['term_months']
        )

        # Uporedi troškove
        old_remaining_cost = sum(
            item['monthly_payment']
            for item in current_schedule[months_paid:]
        )

        new_total_cost = new_summary['total_cost']

        savings = old_remaining_cost - new_total_cost

        return {
            'savings': savings,
            'old_cost': old_remaining_cost,
            'new_cost': new_total_cost,
            'recommendation': 'refinance' if savings > 0 else 'keep_current'
        }
```

**b) Kredit sa grejs periodom:**

```python
def calculate_with_grace_period(
    amount: float,
    rate: float,
    term: int,
    grace_months: int
):
    # Tokom grejs perioda plaća se samo kamata
    monthly_rate = rate / 12 / 100

    schedule = []

    # Grace period
    for month in range(1, grace_months + 1):
        interest = amount * monthly_rate
        schedule.append({
            'month': month,
            'monthly_payment': interest,
            'principal': 0,
            'interest': interest,
            'remaining_balance': amount
        })

    # Regularni kredit nakon grejs perioda
    regular_schedule, _ = CreditCalculator.calculate_annuity(
        amount, rate, term,
        start_date=datetime.now() + timedelta(days=30*grace_months)
    )

    schedule.extend(regular_schedule)

    return schedule
```

**c) Poređenje raznih banaka:**

```javascript
const BankComparison = () => {
  const [banks, setBanks] = useState([
    { name: "Banka A", rate: 5.5, fees: 1000 },
    { name: "Banka B", rate: 5.8, fees: 500 },
    { name: "Banka C", rate: 5.3, fees: 1500 },
  ]);

  const calculateTotalCost = (bank) => {
    // Izračunaj ukupni trošak uključujući naknade
    const creditCost = calculateCredit(amount, bank.rate, term);
    return creditCost.total_cost + bank.fees;
  };

  return (
    <div>
      <h2>Uporedba banaka</h2>
      {banks.map((bank) => (
        <BankCard
          key={bank.name}
          bank={bank}
          totalCost={calculateTotalCost(bank)}
        />
      ))}
    </div>
  );
};
```

---

### 7. Mobilna aplikacija (React Native)

**Struktura:**

```
mobile/
├── src/
│   ├── screens/
│   │   ├── CalculatorScreen.js
│   │   ├── ResultsScreen.js
│   │   └── ComparisonScreen.js
│   ├── components/
│   │   └── (reuse from web)
│   ├── services/
│   │   └── api.js (same as web)
│   └── App.js
└── package.json
```

**Key changes:**

```javascript
// Use React Native components instead of HTML
import { View, Text, TextInput, TouchableOpacity } from "react-native";

// Use React Native Chart Kit
import { LineChart } from "react-native-chart-kit";

// Native PDF viewer
import Pdf from "react-native-pdf";
```

---

### 8. Dark mode

**Frontend implementacija:**

```javascript
// src/context/ThemeContext.jsx
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1a1a',
          card: '#2d2d2d',
          text: '#e5e5e5'
        }
      }
    }
  }
}

// Usage in components
<div className="bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text">
```

---

### 9. Lokalizacija (i18n)

```javascript
// frontend/src/i18n/config.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    sr: {
      translation: {
        credit_amount: "Iznos kredita",
        interest_rate: "Kamatna stopa",
        // ...
      },
    },
    en: {
      translation: {
        credit_amount: "Credit Amount",
        interest_rate: "Interest Rate",
        // ...
      },
    },
  },
  lng: "sr",
  fallbackLng: "sr",
});

// Usage
import { useTranslation } from "react-i18next";

const CreditForm = () => {
  const { t } = useTranslation();

  return <label>{t("credit_amount")}</label>;
};
```

---

### 10. Advanced Analytics Dashboard

```javascript
const AnalyticsDashboard = ({ userCredits }) => {
  const totalBorrowed = userCredits.reduce((sum, c) => sum + c.amount, 0);
  const totalInterest = userCredits.reduce(
    (sum, c) => sum + c.total_interest,
    0
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard
        title="Ukupno pozajmljeno"
        value={formatCurrency(totalBorrowed)}
        icon={<DollarSign />}
      />
      <MetricCard
        title="Ukupna kamata"
        value={formatCurrency(totalInterest)}
        icon={<TrendingUp />}
      />
      <MetricCard
        title="Prosječna stopa"
        value={`${calculateAvgRate(userCredits)}%`}
        icon={<Percent />}
      />

      {/* Timeline grafovi */}
      <TimelineChart credits={userCredits} />

      {/* Distribucija po tipovima */}
      <TypeDistributionChart credits={userCredits} />
    </div>
  );
};
```

---

## 📦 Prioriteti implementacije

### Faza 1 (Kratkoročno)

1. ✅ Osnovne funkcionalnosti - **GOTOVO**
2. ✅ Vizualizacije - **GOTOVO**
3. ✅ PDF export - **GOTOVO**
4. CSV export
5. Dark mode

### Faza 2 (Srednjoročno)

1. Autentifikacija
2. Baza podataka
3. Čuvanje kredita
4. Email notifikacije
5. Excel export

### Faza 3 (Dugoročno)

1. Mobilna aplikacija
2. Advanced analytics
3. Refinansiranje kalkulator
4. Lokalizacija
5. Real-time banco data integration

---

## 🔧 Tehnički zahtjevi za proširenja

### Za autentifikaciju:

```
Backend: python-jose, passlib, bcrypt
Frontend: react-router-dom v6, jwt-decode
```

### Za bazu podataka:

```
Backend: sqlalchemy, alembic, psycopg2 (PostgreSQL)
ili sqlite3 za development
```

### Za email:

```
Backend: fastapi-mail, aiosmtplib
```

### Za Excel:

```
Backend: openpyxl
```

### Za lokalizaciju:

```
Frontend: react-i18next, i18next
```

---

**Napomena**: Sve ove funkcionalnosti su dizajnirane da se lako integrišu sa postojećom arhitekturom. Modularni pristup omogućava dodavanje novih funkcija bez modifikacije osnovnog koda.
