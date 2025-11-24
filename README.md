# Kreditni Kalkulator

Kompleksna web aplikacija za izračun i analizu kredita sa naprednim funkcionalnostima.

## 📋 Pregled

Ova aplikacija omogućava:

- **Osnovni izračuni**: Anuitetni i linearni modeli kredita
- **Vizualizacije**: Interaktivni grafovi sa Chart.js
- **Napredne funkcije**:
  - Prijevremena otplata (djelimična/potpuna)
  - Simulacija promjene kamatne stope
  - Uporedba 2-3 kredita
  - PDF izvještaji
- **Detaljan otplatni plan**: Mjesečni pregled sa glavnicom, kamatom i preostalim dugom

## 🛠️ Tehnologije

### Backend

- **Python 3.9+**
- **FastAPI** - moderne REST API
- **Pydantic** - validacija podataka
- **ReportLab** - generisanje PDF dokumenata
- **Uvicorn** - ASGI server

### Frontend

- **React 18** - UI framework
- **Vite** - build tool
- **TailwindCSS** - styling
- **Chart.js** - vizualizacije
- **Axios** - HTTP klijent
- **Lucide React** - ikone

## 📁 Struktura projekta

```
credit-calculator/
│
├── backend/                    # Python FastAPI backend
│   ├── app/
│   │   ├── models/
│   │   │   └── credit.py      # Pydantic modeli
│   │   ├── services/
│   │   │   ├── credit_calculator.py  # Logika izračuna
│   │   │   └── pdf_generator.py      # PDF generisanje
│   │   ├── main.py            # FastAPI aplikacija
│   │   └── __init__.py
│   └── requirements.txt        # Python zavisnosti
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React komponente
│   │   │   ├── CreditForm.jsx
│   │   │   ├── CreditSummary.jsx
│   │   │   ├── PaymentScheduleTable.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── AdvancedFeatures.jsx
│   │   │   └── ComparisonTool.jsx
│   │   ├── services/
│   │   │   └── api.js         # API komunikacija
│   │   ├── utils/
│   │   │   └── formatters.js  # Utility funkcije
│   │   ├── App.jsx            # Glavna komponenta
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Globalni stilovi
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md                   # Dokumentacija
```

## 🚀 Instalacija i pokretanje

### Preduvjeti

- Python 3.9 ili noviji
- Node.js 16+ i npm/yarn
- Git

### Backend setup

1. **Kreirajte Python virtuelno okruženje:**

```powershell
cd backend
python -m venv venv
```

2. **Aktivirajte virtuelno okruženje:**

```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
.\venv\Scripts\activate.bat
```

3. **Instalirajte zavisnosti:**

```powershell
pip install -r requirements.txt
```

4. **Pokrenite backend server:**

```powershell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend će biti dostupan na: `http://localhost:8000`

API dokumentacija: `http://localhost:8000/docs`

### Frontend setup

1. **Otvorite novi terminal i idite u frontend direktorijum:**

```powershell
cd frontend
```

2. **Instalirajte zavisnosti:**

```powershell
npm install
```

3. **Pokrenite development server:**

```powershell
npm run dev
```

Frontend će biti dostupan na: `http://localhost:3000`

## 📖 Upotreba

### Osnovni izračun kredita

1. Popunite formu sa parametrima kredita:

   - Iznos kredita (KM)
   - Godišnja kamatna stopa (%)
   - Rok otplate (mjeseci ili godine)
   - Tip otplate (anuitetni ili linearni)
   - Datum početka

2. Kliknite "Izračunaj kredit"

3. Pregledajte rezultate:
   - Sažetak troškova
   - Otplatni plan
   - Grafove

### Prijevremena otplata

1. Nakon osnovnog izračuna, idite na "Napredne funkcionalnosti"
2. Izaberite tab "Prijevremena otplata"
3. Unesite iznos i mjesec prijevremene otplate
4. Kliknite "Simuliraj prijevremenu otplatu"

### Promjena kamatne stope

1. U "Naprednim funkcionalnostima", izaberite tab "Promjena kamate"
2. Unesite promjenu (npr. +1% ili -0.5%)
3. Kliknite "Simuliraj promjenu kamate"

### Uporedba kredita

1. Idite na tab "Uporedba kredita"
2. Dodajte 2-3 kredita za uporedbu
3. Popunite parametre svakog kredita
4. Kliknite "Uporedi kredite"
5. Pregledajte uporednu tabelu i preporuku

### PDF izvještaji

- **Pojedinačni kredit**: Kliknite "Preuzmi PDF izvještaj" na glavnoj stranici
- **Uporedba**: Kliknite "Preuzmi PDF" na stranici uporedbe

## 🔧 API Endpoints

### `POST /calculate`

Izračunaj kredit (anuitetni ili linearni)

**Request body:**

```json
{
  "amount": 50000,
  "annual_interest_rate": 5.5,
  "term_months": 60,
  "payment_type": "annuity",
  "start_date": "2025-01-01"
}
```

### `POST /calculate/prepayment`

Izračunaj sa prijevremenom otplatom

**Query params:** Osnovni podaci kredita  
**Request body:**

```json
{
  "amount": 10000,
  "month": 12,
  "type": "partial"
}
```

### `POST /calculate/rate-change`

Simulacija promjene kamatne stope

**Request body:**

```json
{
  "rate_change": 1.0
}
```

### `POST /compare`

Uporedi više kredita

**Request body:**

```json
{
  "credits": [
    {
      "amount": 50000,
      "annual_interest_rate": 5.5,
      "term_months": 60,
      "payment_type": "annuity"
    },
    {
      "amount": 50000,
      "annual_interest_rate": 6.0,
      "term_months": 60,
      "payment_type": "linear"
    }
  ]
}
```

### `POST /export/pdf`

Generiši PDF izvještaj

### `POST /export/comparison-pdf`

Generiši uporedni PDF izvještaj

## 📐 Matematički modeli

### Anuitetni model (fiksna rata)

Formula za mjesečnu ratu:

```
A = P × [r(1+r)^n] / [(1+r)^n - 1]
```

Gdje je:

- A = mjesečna rata
- P = iznos kredita
- r = mjesečna kamatna stopa (godišnja/12)
- n = broj mjeseci

### Linearni model (opadajuća rata)

- Fiksni dio glavnice = Ukupan iznos / Broj mjeseci
- Kamata svaki mjesec = Preostali dug × Mjesečna stopa
- Mjesečna rata = Fiksni dio glavnice + Kamata

## 🎨 Komponente

### CreditForm

Forma za unos parametara kredita sa validacijom

### CreditSummary

Prikaz sažetka kredita sa ključnim metrikama

### PaymentScheduleTable

Tabela sa detaljnim otplatnim planom i paginacijom

### Charts

Tri interaktivna grafa:

1. Linijski - preostali dug
2. Stacked bar - struktura rata
3. Doughnut - distribucija troškova

### AdvancedFeatures

Panel sa naprednim funkcijama (prijevremena otplata, promjena kamate)

### ComparisonTool

Alat za uporedbu 2-3 kredita

## 🧪 Testiranje

### Backend testovi

```powershell
cd backend
pytest
```

### Frontend testovi

```powershell
cd frontend
npm test
```

## 📦 Production build

### Backend

```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend

```powershell
cd frontend
npm run build
```

Build fajlovi će biti u `frontend/dist/` direktorijumu.

## 🔐 Sigurnost

- CORS konfigurisan za development (localhost:3000)
- Input validacija na backend strani
- Pydantic modeli za type safety
- Error handling na oba sloja

## 🐛 Troubleshooting

### Backend ne može da se pokrene

- Provjerite da li je Python 3.9+ instaliran: `python --version`
- Provjerite da li je virtuelno okruženje aktivirano
- Reinstalirajte zavisnosti: `pip install -r requirements.txt --force-reinstall`

### Frontend ne može da se pokrene

- Provjerite Node.js verziju: `node --version` (potrebno 16+)
- Obrišite node_modules i reinstalirajte: `Remove-Item -Recurse -Force node_modules; npm install`
- Provjerite da li je port 3000 slobodan

### API greške

- Provjerite da li backend radi na portu 8000
- Pregledajte browser console za detaljne greške
- Provjerite network tab u developer tools

## 🤝 Doprinosi

Projekat je organizovan modularno:

- Backend servisi su odvojeni po funkcionalnosti
- Frontend komponente su reusable
- Jasna separacija prezentacione i biznis logike

## 📝 Licence

Ovaj projekat je kreiran za edukativne svrhe.

## 📞 Kontakt

Za pitanja i podršku, otvorite issue na GitHub repozitorijumu.

---

**Napomena**: Aplikacija služi samo za informativne svrhe. Za precizne podatke o kreditima, konsultujte se sa bankom.
