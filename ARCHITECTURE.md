# Arhitektura Kreditnog Kalkulatora

## 🏗️ Pregled arhitekture

Aplikacija je organizovana kao moderna web aplikacija sa jasno odvojenim frontend i backend slojevima.

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │         React Application (Frontend)              │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  │  │
│  │  │ Components │  │  Services  │  │   Utils    │  │  │
│  │  │   (UI)     │  │   (API)    │  │(Formatters)│  │  │
│  │  └────────────┘  └────────────┘  └────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                    HTTP/REST API
                          │
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend (Python)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │              API Layer (Endpoints)                │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  │  │
│  │  │   Models   │  │  Services  │  │  Utilities │  │  │
│  │  │ (Pydantic) │  │(Calculator)│  │    (PDF)   │  │  │
│  │  └────────────┘  └────────────┘  └────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 📦 Backend arhitektura

### Slojevi

1. **API Layer (main.py)**

   - FastAPI endpoints
   - Request/Response handling
   - CORS middleware
   - Error handling

2. **Models Layer (models/credit.py)**

   - Pydantic modeli za validaciju
   - Type hints
   - Request/Response schemas

3. **Service Layer (services/)**
   - **CreditCalculator**: Biznis logika za izračun kredita
   - **PDFGenerator**: Generisanje izvještaja

### Design Patterns

#### 1. Service Pattern

Biznis logika je izdvojena u servisne klase:

```python
class CreditCalculator:
    @staticmethod
    def calculate_annuity(...)

    @staticmethod
    def calculate_linear(...)

    @staticmethod
    def calculate_with_prepayment(...)
```

#### 2. DTO Pattern (Data Transfer Objects)

Pydantic modeli služe kao DTO:

```python
class CreditInput(BaseModel):
    amount: float
    annual_interest_rate: float
    term_months: int
    payment_type: Literal["annuity", "linear"]
```

#### 3. Factory Pattern

PDF generator kreira različite tipove izvještaja:

```python
PDFGenerator.generate_credit_report(...)
PDFGenerator.generate_comparison_report(...)
```

## 🎨 Frontend arhitektura

### Slojevi

1. **Presentation Layer (Components)**

   - React functional components
   - Hooks za state management
   - Props za komunikaciju između komponenata

2. **Service Layer (services/api.js)**

   - HTTP klijent (Axios)
   - API wrappers
   - Error handling

3. **Utility Layer (utils/formatters.js)**
   - Formatiranje valuta
   - Validacija
   - Konverzije

### Component Hierarchy

```
App
├── Header
├── Navigation
│   ├── Calculator Tab
│   └── Comparison Tab
│
├── Calculator View
│   ├── CreditForm
│   ├── CreditSummary
│   ├── AdvancedFeatures
│   │   ├── Prepayment Tab
│   │   └── Rate Change Tab
│   ├── Charts
│   │   ├── Line Chart
│   │   ├── Bar Chart
│   │   └── Doughnut Chart
│   └── PaymentScheduleTable
│
└── Comparison View
    └── ComparisonTool
        ├── Credit Inputs (1-3)
        └── Comparison Results
```

### State Management

Koristi se React Hook useState za lokalni state:

```javascript
// Global state u App.jsx
const [creditData, setCreditData] = useState(null);
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### Data Flow

1. **User Input** → CreditForm
2. **Form Submit** → API call (axios)
3. **Backend Processing** → CreditCalculator
4. **Response** → State update
5. **State Change** → Re-render komponenata
6. **Display** → Charts, Tables, Summary

## 🔄 API Communication

### Request Flow

```
Frontend Component
    │
    ├─→ services/api.js
    │       │
    │       ├─→ axios.post('/calculate', data)
    │       │
    │       └─→ HTTP Request
    │               │
    │               ├─→ FastAPI Endpoint
    │               │       │
    │               │       ├─→ Pydantic Validation
    │               │       │
    │               │       ├─→ Service Layer (Calculator)
    │               │       │
    │               │       └─→ Response Model
    │               │
    │               └─→ HTTP Response
    │
    └─→ State Update → Re-render
```

### Error Handling

**Backend:**

```python
try:
    # Processing
    return result
except Exception as e:
    raise HTTPException(status_code=400, detail=str(e))
```

**Frontend:**

```javascript
try {
  const response = await creditAPI.calculateCredit(data);
  setResult(response);
} catch (err) {
  setError(err.response?.data?.detail || "Error message");
}
```

## 📊 Data Models

### Credit Calculation Flow

```
Input Data
    ↓
┌─────────────────────┐
│   CreditInput       │
│  - amount           │
│  - interest_rate    │
│  - term_months      │
│  - payment_type     │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ CreditCalculator    │
│  calculate_*()      │
└─────────────────────┘
    ↓
┌─────────────────────────────┐
│  Calculation Results        │
│  ┌───────────────────────┐  │
│  │ Summary               │  │
│  │ - total_amount        │  │
│  │ - total_interest      │  │
│  │ - total_cost          │  │
│  │ - monthly_payment_avg │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Schedule (array)      │  │
│  │ - month               │  │
│  │ - payment_date        │  │
│  │ - monthly_payment     │  │
│  │ - principal           │  │
│  │ - interest            │  │
│  │ - remaining_balance   │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
    ↓
┌─────────────────────┐
│ Frontend Display    │
│  - Summary cards    │
│  - Charts           │
│  - Tables           │
└─────────────────────┘
```

## 🔐 Security Considerations

### Backend

1. **Input Validation**: Pydantic modeli validiraju sve inpute
2. **Type Safety**: Python type hints + Pydantic
3. **Error Sanitization**: Generičke error poruke za korisnike
4. **CORS**: Konfigurisan samo za development origine

### Frontend

1. **XSS Protection**: React automatski escape-uje output
2. **Input Validation**: Validacija prije slanja na backend
3. **Error Handling**: Graceful degradation
4. **Type Safety**: PropTypes ili TypeScript (opciono)

## 📈 Scalability

### Trenutna arhitektura

- **Stateless backend**: Sve request su nezavisni
- **No database**: In-memory izračuni
- **Client-side rendering**: React SPA

### Moguće ekstenzije

1. **Database layer**

   - Čuvanje korisničkih kredita
   - Istorija izračuna
   - SQLAlchemy ORM

2. **Authentication**

   - JWT tokens
   - User accounts
   - OAuth2

3. **Caching**

   - Redis za često korištene izračune
   - Browser caching za statičke resurse

4. **Microservices**
   - Separate calculator service
   - PDF generation service
   - Notification service

## 🧪 Testing Strategy

### Backend Tests

```python
# Unit tests
test_calculate_annuity()
test_calculate_linear()
test_prepayment()

# Integration tests
test_api_calculate_endpoint()
test_pdf_generation()
```

### Frontend Tests

```javascript
// Component tests
test('renders credit form', ...)
test('submits valid data', ...)

// Integration tests
test('full calculation flow', ...)
```

## 🚀 Deployment Architecture

### Development

```
localhost:3000 (React Dev Server)
    ↓
localhost:8000 (FastAPI Uvicorn)
```

### Production

```
CDN / Nginx (Static files)
    ↓
Reverse Proxy (Nginx)
    ↓
Gunicorn + Uvicorn Workers
    ↓
FastAPI Application
```

## 📚 Technology Justification

### Zašto FastAPI?

- Automatska API dokumentacija (Swagger/ReDoc)
- Async support
- Brza validacija sa Pydantic
- Moderna Python arhitektura

### Zašto React?

- Component-based architecture
- Virtual DOM za performance
- Veliki ekosistem (Chart.js, Axios, etc.)
- Jednostavno za održavanje

### Zašto TailwindCSS?

- Utility-first pristup
- Responsive design out-of-the-box
- Mala veličina bundle-a (sa purge)
- Konzistentan design system

### Zašto Chart.js?

- Open source
- Jednostavno za korištenje
- Responsive charts
- Canvas-based rendering (performanse)

## 🔧 Configuration Management

### Environment Variables

**Backend (.env):**

```
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
DEBUG=True
```

**Frontend (.env):**

```
VITE_API_URL=http://localhost:8000
```

## 📊 Performance Considerations

1. **Backend**

   - O(n) kompleksnost za generisanje schedule
   - Streaming PDF responses
   - No blocking operations

2. **Frontend**
   - Code splitting (React.lazy)
   - Chart rendering optimizacija
   - Pagination za velike otplatne planove
   - Debouncing za user input

## 🎯 Best Practices Applied

1. **Separation of Concerns**: Layers su jasno odvojeni
2. **DRY Principle**: Reusable komponente i utility funkcije
3. **Single Responsibility**: Svaka klasa/funkcija ima jedan zadatak
4. **Type Safety**: Pydantic + optional TypeScript
5. **Error Handling**: Graceful error handling na svim nivoima
6. **Documentation**: Docstrings i komentari
7. **Modularity**: Lako se dodaju nove funkcionalnosti

---

**Napomena**: Ova arhitektura je dizajnirana da bude skalabilna i održiva, sa jasnim putanjama za dodavanje novih funkcionalnosti.
