# ⚡ Brzi vodič za pokretanje

## 🎯 Za nestrpljive

### Windows (PowerShell)

```powershell
# 1. Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# 2. Novi terminal - Frontend
cd frontend
npm install
npm run dev
```

Zatim otvorite: http://localhost:3000

---

## 📝 Detaljne instrukcije

### Korak 1: Instalacija Python zavisnosti

```powershell
cd c:\Users\demir\Desktop\credit-calculator\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Provjera instalacije:**

```powershell
pip list
# Trebate vidjeti: fastapi, uvicorn, pydantic, reportlab
```

### Korak 2: Pokretanje backend servera

```powershell
# Iz backend direktorijuma
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Očekivani output:**

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Testiranje backend-a:**

- Otvorite: http://localhost:8000
- API dokumentacija: http://localhost:8000/docs

### Korak 3: Instalacija Node.js zavisnosti

**Otvorite NOVI terminal:**

```powershell
cd c:\Users\demir\Desktop\credit-calculator\frontend
npm install
```

**Ako npm install sporo radi, koristite:**

```powershell
npm install --prefer-offline --no-audit
```

### Korak 4: Pokretanje frontend aplikacije

```powershell
# Iz frontend direktorijuma
npm run dev
```

**Očekivani output:**

```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Otvorite browser:** http://localhost:3000

---

## 🐛 Troubleshooting

### Problem 1: Python nije pronađen

**Rješenje:**

```powershell
# Instalirajte Python 3.9+ sa python.org
# Ili koristite winget:
winget install Python.Python.3.11
```

### Problem 2: venv aktivacija ne radi

**Rješenje - Execution Policy:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problem 3: Port 8000 zauzet

**Rješenje:**

```powershell
# Pronađi proces na portu 8000
netstat -ano | findstr :8000

# Ubij proces (zamijenite PID)
taskkill /PID <PID> /F

# Ili koristite drugi port
python -m uvicorn app.main:app --reload --port 8001
```

### Problem 4: Port 3000 zauzet

**Rješenje:**

```powershell
# Vite će automatski ponuditi alternativni port (3001)
# Ili korisite:
npm run dev -- --port 3001
```

### Problem 5: npm ERR! code ENOENT

**Rješenje:**

```powershell
# Obrišite node_modules i pokušajte ponovo
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### Problem 6: ReportLab greška

**Rješenje:**

```powershell
# Ponovo instalirajte sa build tools
pip uninstall reportlab
pip install --upgrade reportlab
```

### Problem 7: CORS greška u browseru

**Provjera:**

- Backend mora biti pokrenut na http://localhost:8000
- Frontend mora biti pokrenut na http://localhost:3000
- Osvježite stranicu (Ctrl + F5)

---

## ✅ Provjera da li sve radi

### Backend test

```powershell
# Test endpoint
curl http://localhost:8000/

# Očekivani response:
# {"message":"Kreditni Kalkulator API","version":"1.0.0", ...}
```

### Frontend test

1. Otvorite http://localhost:3000
2. Trebate vidjeti formu za unos kredita
3. Popunite formu:
   - Iznos: 50000
   - Kamatna stopa: 5.5
   - Rok: 60 mjeseci
   - Tip: Anuitetni
4. Kliknite "Izračunaj kredit"
5. Trebate vidjeti rezultate

---

## 🎬 Prvi test aplikacije

### Scenario 1: Osnovni izračun

1. **Unos:**

   - Iznos kredita: 100,000 KM
   - Kamatna stopa: 6%
   - Rok: 120 mjeseci (10 godina)
   - Tip: Anuitetni

2. **Očekivani rezultati:**

   - Mjesečna rata: ~1,110 KM
   - Ukupna kamata: ~33,200 KM
   - Ukupni trošak: ~133,200 KM

3. **Provjera:**
   - Sažetak prikazuje ispravne brojeve
   - Grafovi se prikazuju
   - Otplatni plan ima 120 redova

### Scenario 2: Prijevremena otplata

1. Prvo izračunajte osnovni kredit (kao u Scenariju 1)
2. Idite na "Napredne funkcionalnosti"
3. Unesite:
   - Iznos: 20,000 KM
   - Mjesec: 12
   - Tip: Djelimična otplata
4. Kliknite "Simuliraj prijevremenu otplatu"
5. Provjerite da je ukupna kamata smanjena

### Scenario 3: Uporedba kredita

1. Idite na tab "Uporedba kredita"
2. Dodajte 3 kredita:
   - Kredit 1: 50,000 KM, 5.5%, 60 mj, Anuitetni
   - Kredit 2: 50,000 KM, 6.0%, 60 mj, Anuitetni
   - Kredit 3: 50,000 KM, 5.5%, 72 mj, Linearni
3. Kliknite "Uporedi kredite"
4. Provjerite uporednu tabelu i preporuku

### Scenario 4: PDF export

1. Izračunajte kredit
2. Kliknite "Preuzmi PDF izvještaj"
3. PDF bi trebao biti preuzet
4. Otvorite PDF i provjerite sadržaj

---

## 🔧 Dodatna konfiguracija (opciono)

### Environment varijable

**Backend (.env):**

```env
# backend/.env
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Frontend (.env):**

```env
# frontend/.env
VITE_API_URL=http://localhost:8000
```

### Custom portovi

**Backend - drugi port:**

```powershell
python -m uvicorn app.main:app --reload --port 8080
```

**Frontend - ažurirajte vite.config.js:**

```javascript
export default defineConfig({
  server: {
    port: 3001,
  },
});
```

---

## 📊 Primjeri za testiranje

### Test 1: Mali kredit

- Iznos: 10,000 KM
- Kamata: 8%
- Rok: 24 mjeseca
- Očekivana rata: ~452 KM

### Test 2: Hipotekarni kredit

- Iznos: 200,000 KM
- Kamata: 4.5%
- Rok: 300 mjeseci (25 godina)
- Očekivana rata: ~1,111 KM

### Test 3: Bez kamate (test edge case)

- Iznos: 12,000 KM
- Kamata: 0%
- Rok: 12 mjeseci
- Očekivana rata: 1,000 KM

---

## 🚀 Spremno za produkciju

Kada je sve testirano:

```powershell
# Frontend build
cd frontend
npm run build

# Build fajlovi su u frontend/dist/
```

Za deployment na server, pogledajte README.md sekciju "Production build".

---

## 📞 Pomoć

Ako nešto ne radi:

1. Provjerite da li su oba servera pokrenuta
2. Provjerite browser console za greške (F12)
3. Provjerite terminal output za greške
4. Osvježite stranicu (Ctrl + F5)
5. Restartujte oba servera

**Uobičajene greške i rješenja su u TROUBLESHOOTING sekciji iznad.**

---

**Sretno sa korištenjem Kreditnog Kalkulatora! 🎉**
