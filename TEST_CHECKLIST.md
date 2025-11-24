# ✅ Test Checklist - Kreditni Kalkulator

## 🎯 Pre-launch checklist

Koristite ovaj checklist da provjerite da li sve funkcionalnosti rade ispravno.

---

## 📋 SETUP

### Backend Setup

- [ ] Python 3.9+ instaliran
- [ ] Virtual environment kreiran (`python -m venv venv`)
- [ ] Virtual environment aktiviran
- [ ] Dependencies instalirani (`pip install -r requirements.txt`)
- [ ] Backend server pokrenut bez grešaka
- [ ] Backend dostupan na http://localhost:8000
- [ ] API docs dostupni na http://localhost:8000/docs

### Frontend Setup

- [ ] Node.js 16+ instaliran
- [ ] npm dependencies instalirani (`npm install`)
- [ ] Frontend server pokrenut bez grešaka
- [ ] Frontend dostupan na http://localhost:3000
- [ ] Nema console errors u browseru (F12)

---

## 🧪 FUNKCIONALNI TESTOVI

### Test 1: Osnovni anuitetni kredit

**Scenario:** Kredit od 50,000 KM, 5.5%, 60 mjeseci, anuitetni

**Input:**

- [ ] Iznos: 50000
- [ ] Kamata: 5.5
- [ ] Rok: 60 mjeseci
- [ ] Tip: Anuitetni
- [ ] Datum: Današnji datum

**Akcija:**

- [ ] Klik na "Izračunaj kredit"

**Očekivani rezultati:**

- [ ] Loading spinner prikazan tokom računanja
- [ ] Sažetak prikazan (4 kartice)
- [ ] Iznos kredita: 50,000.00 KM
- [ ] Ukupna kamata: ~7,354 KM
- [ ] Ukupni trošak: ~57,354 KM
- [ ] Mjesečna rata: ~956 KM
- [ ] Otplatni plan ima 60 redova
- [ ] Prvi red: mjesec 1, rata ~956 KM
- [ ] Posljednji red: mjesec 60, preostali dug 0.00 KM
- [ ] Grafovi prikazani (3 komada)
- [ ] Line chart pokazuje opadajuću liniju
- [ ] Bar chart prikazan sa zelenom i narandžastom bojom
- [ ] Doughnut chart prikazan sa 2 segmenta

**PDF Export:**

- [ ] Klik na "Preuzmi PDF izvještaj"
- [ ] PDF preuzet bez greške
- [ ] PDF sadrži naslov "Izvještaj o Kreditu"
- [ ] PDF sadrži sažetak troškova
- [ ] PDF sadrži otplatni plan
- [ ] PDF se može otvoriti u PDF čitaču

---

### Test 2: Linearni kredit

**Scenario:** Isti iznos, ali linearni model

**Input:**

- [ ] Iznos: 50000
- [ ] Kamata: 5.5
- [ ] Rok: 60 mjeseci
- [ ] Tip: Linearni
- [ ] Datum: Današnji datum

**Akcija:**

- [ ] Klik na "Izračunaj kredit"

**Očekivani rezultati:**

- [ ] Sažetak prikazan
- [ ] Tip otplate: "Linearni"
- [ ] Prva rata VEĆA od posljednje rate
- [ ] Glavnica ISTA u svakom mjesecu (~833.33 KM)
- [ ] Kamata OPADA kroz mjesece
- [ ] Posljednji mjesec: najniža rata
- [ ] Grafovi ažurirani sa novim podacima

---

### Test 3: Prijevremena otplata - djelimična

**Scenario:** Otplata 10,000 KM u 12. mjesecu

**Priprema:**

- [ ] Izračunati osnovni kredit (50,000 KM, 5.5%, 60 mj, anuitetni)

**Akcija:**

- [ ] Klik na "Napredne funkcionalnosti"
- [ ] Unesite iznos: 10000
- [ ] Unesite mjesec: 12
- [ ] Tip: Djelimična otplata
- [ ] Klik na "Simuliraj prijevremenu otplatu"

**Očekivani rezultati:**

- [ ] Loading prikazan
- [ ] Novi sažetak prikazan
- [ ] Ukupna kamata SMANJENA (manja od ~7,354 KM)
- [ ] Ukupni trošak SMANJEN
- [ ] Prikazana ušteda ("Ušteda sa prijevremenom otplatom: X KM")
- [ ] Otplatni plan ima više od 12 redova (kredit nije potpuno otplaćen)
- [ ] 12. mjesec ima informaciju o prijevremnoj otplati (ako prikazana)
- [ ] Grafovi ažurirani

---

### Test 4: Prijevremena otplata - potpuna

**Scenario:** Otplata cijelog preostalog duga u 12. mjesecu

**Akcija:**

- [ ] Izračunati osnovni kredit
- [ ] U naprednim funkcionalnostima unesite visok iznos (npr. 100,000 KM)
- [ ] Mjesec: 12
- [ ] Tip: Potpuna otplata
- [ ] Klik na "Simuliraj prijevremenu otplatu"

**Očekivani rezultati:**

- [ ] Otplatni plan ima SAMO 12 redova
- [ ] 12. mjesec: preostali dug = 0.00 KM
- [ ] Ukupna kamata MNOGO MANJA
- [ ] Velika ušteda prikazana

---

### Test 5: Promjena kamatne stope

**Scenario:** Povećanje kamate za 1%

**Akcija:**

- [ ] Izračunati osnovni kredit (50,000 KM, 5.5%, 60 mj)
- [ ] Klik na tab "Promjena kamate"
- [ ] Unesite: 1 (ili kliknite "+1%" dugme)
- [ ] Klik na "Simuliraj promjenu kamate"

**Očekivani rezultati:**

- [ ] Nova kamatna stopa: 6.5%
- [ ] Ukupna kamata VEĆA nego u osnovnom scenariju
- [ ] Mjesečna rata VEĆA
- [ ] Sažetak ažuriran
- [ ] Grafovi ažurirani

**Scenario 2:** Smanjenje kamate za 0.5%

**Akcija:**

- [ ] Unesite: -0.5 (ili kliknite "-0.5%" dugme)
- [ ] Klik na "Simuliraj promjenu kamate"

**Očekivani rezultati:**

- [ ] Nova kamatna stopa: 5.0%
- [ ] Ukupna kamata MANJA
- [ ] Mjesečna rata MANJA

---

### Test 6: Uporedba kredita (2 kredita)

**Scenario:** Uporedi 2 kredita sa različitim kamatnim stopama

**Akcija:**

- [ ] Klik na tab "Uporedba kredita"
- [ ] Kredit 1: 50,000 KM, 5.5%, 60 mj, Anuitetni
- [ ] Kredit 2: 50,000 KM, 6.0%, 60 mj, Anuitetni
- [ ] Klik na "Uporedi kredite"

**Očekivani rezultati:**

- [ ] Loading prikazan
- [ ] Uporedna tabela prikazana sa 2 kolone
- [ ] Kredit 1 ima NIŽU ukupnu kamatu
- [ ] Kredit 2 ima VIŠU ukupnu kamatu
- [ ] Kredit 1 označen kao "✓ Najbolja opcija"
- [ ] Preporuka prikazana: "Kredit 1"
- [ ] "Preuzmi PDF" dugme dostupno

**PDF Export:**

- [ ] Klik na "Preuzmi PDF"
- [ ] Uporedni PDF preuzet
- [ ] PDF sadrži uporednu tabelu
- [ ] PDF sadrži preporuku

---

### Test 7: Uporedba kredita (3 kredita)

**Scenario:** Maksimalan broj kredita

**Akcija:**

- [ ] Klik na "Dodaj kredit"
- [ ] Kredit 3: 50,000 KM, 5.3%, 72 mj, Linearni
- [ ] Klik na "Uporedi kredite"

**Očekivani rezultati:**

- [ ] Uporedna tabela ima 3 kolone
- [ ] Sve 3 kolone popunjene
- [ ] Najjeftiniji kredit označen
- [ ] Dugme "Dodaj kredit" disablovano (max 3)

**Brisanje kredita:**

- [ ] Klik na [X] dugme na Kreditu 3
- [ ] Kredit 3 uklonjen
- [ ] Dugme "Dodaj kredit" ponovo omogućeno

---

### Test 8: CSV Export

**Scenario:** Export otplatnog plana u CSV

**Akcija:**

- [ ] Izračunati kredit
- [ ] U tabeli otplatnog plana kliknuti "Izvezi CSV"

**Očekivani rezultati:**

- [ ] CSV fajl preuzet (otplatni*plan*\*.csv)
- [ ] CSV sadrži header: Mjesec,Datum,Rata,Glavnica,Kamata,Preostali dug
- [ ] CSV sadrži sve redove iz otplatnog plana
- [ ] CSV se može otvoriti u Excel-u
- [ ] Podaci u CSV-u tačni

---

### Test 9: Paginacija otplatnog plana

**Scenario:** Kredit sa više od 12 mjeseci

**Akcija:**

- [ ] Izračunati kredit sa 120 mjeseci
- [ ] Skrolovati do tabele

**Očekivani rezultati:**

- [ ] Tabela prikazuje prvih 12 redova
- [ ] Paginacija vidljiva: [Prethodna] [1][2]...[10] [Sljedeća]
- [ ] Tekst: "Prikazujem 1-12 od 120 mjeseci"

**Navigacija:**

- [ ] Klik na "Sljedeća"
- [ ] Prikazani redovi 13-24
- [ ] Tekst ažuriran: "Prikazujem 13-24 od 120 mjeseci"
- [ ] Klik na "Prethodna"
- [ ] Vraćeno na redove 1-12
- [ ] Klik na broj stranice (npr. 5)
- [ ] Prikazani redovi 49-60

---

### Test 10: Validacija inputa

**Scenario 1:** Negativan iznos

**Akcija:**

- [ ] Unesite iznos: -5000
- [ ] Klik na "Izračunaj kredit"

**Očekivani rezultati:**

- [ ] Error poruka: "Unesite validan iznos kredita (veći od 0)"
- [ ] Forma nije submitovana

**Scenario 2:** Kamata preko 100%

**Akcija:**

- [ ] Unesite kamatu: 150
- [ ] Klik na "Izračunaj kredit"

**Očekivani rezultati:**

- [ ] Error poruka: "Unesite validnu kamatnu stopu (0-100%)"

**Scenario 3:** Prazan input

**Akcija:**

- [ ] Ostavite iznos prazan
- [ ] Klik na "Izračunaj kredit"

**Očekivani rezultati:**

- [ ] Error poruka prikazana
- [ ] Forma nije submitovana

---

### Test 11: Responsivnost

**Desktop (1920x1080):**

- [ ] Forma i sažetak side-by-side
- [ ] Grafovi 2 po redu (bar i doughnut)
- [ ] Tabela prikazuje sve kolone

**Tablet (768x1024):**

- [ ] Forma iznad sažetka
- [ ] Grafovi stack-ovani
- [ ] Tabela scrollable horizontalno

**Mobile simulation (375x667):**

- [ ] Sve komponente stack-ovane vertikalno
- [ ] Tekst čitljiv
- [ ] Dugmad klikabilna

**Testiranje:**

- [ ] Otvorite DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Testirajte različite rezolucije

---

### Test 12: Error handling

**Scenario 1:** Backend nije pokrenut

**Akcija:**

- [ ] Zaustavite backend server
- [ ] Pokušajte izračunati kredit

**Očekivani rezultati:**

- [ ] Error alert prikazan u UI
- [ ] User-friendly poruka (ne tehnički error)
- [ ] Aplikacija ne crashuje

**Scenario 2:** Nevalidni API response

**Akcija:**

- [ ] (Ovaj test zahtjeva modifikaciju backend koda)

---

### Test 13: Browser compatibility

**Chrome:**

- [ ] Aplikacija se učitava
- [ ] Sve funkcionalnosti rade
- [ ] Grafovi prikazani

**Firefox:**

- [ ] Aplikacija se učitava
- [ ] Sve funkcionalnosti rade
- [ ] Grafovi prikazani

**Edge:**

- [ ] Aplikacija se učitava
- [ ] Sve funkcionalnosti rade
- [ ] Grafovi prikazani

---

### Test 14: Performance

**Large dataset (360 mjeseci):**

- [ ] Izračunati kredit sa 360 mjeseci (30 godina)
- [ ] Mjeriti vrijeme učitavanja

**Očekivani rezultati:**

- [ ] Izračun završen za < 3 sekunde
- [ ] Tabela učitana sa paginacijom
- [ ] Grafovi prikazani bez lagovanja
- [ ] PDF generisan za < 5 sekundi

---

### Test 15: API Dokumentacija

**Akcija:**

- [ ] Otvorite http://localhost:8000/docs

**Očekivani rezultati:**

- [ ] Swagger UI prikazan
- [ ] Svi endpoints listani (8)
- [ ] Svaki endpoint ima opis
- [ ] Možete testirati endpoint direktno iz Swagger UI

**Test endpoint iz Swagger:**

- [ ] Odaberite POST /calculate
- [ ] Klik "Try it out"
- [ ] Unesite test podatke
- [ ] Klik "Execute"
- [ ] Response 200 OK
- [ ] Response body sadrži summary i schedule

---

## 🎨 UI/UX TESTOVI

### Vizuelni elementi

- [ ] Boje su konzistentne
- [ ] Font size čitljiv
- [ ] Ikone prikazane ispravno
- [ ] Spacing adekvatan između elemenata
- [ ] Cards imaju shadows
- [ ] Buttons imaju hover effects
- [ ] Loading spinner animiran

### Accessibility

- [ ] Tab navigation radi (Tab key)
- [ ] Enter submituje formu
- [ ] Labels povezani sa inputima
- [ ] Error messages vidljivi i jasni
- [ ] Kontrast teksta adekvatan

### UX Flow

- [ ] Korisnik može lako pronaći osnovnu formu
- [ ] Submit button jasno vidljiv
- [ ] Rezultati prikazani odmah nakon submitovanja
- [ ] Napredne funkcije dostupne ali ne na putu osnovnom flow-u
- [ ] PDF download intuitivan

---

## 🐛 KNOWN ISSUES (za praćenje)

### Issues da testirate:

1. **Backend CORS:**

   - [ ] Frontend na portu 3000 može pristupiti backend-u na 8000
   - [ ] Nema CORS error u console

2. **PDF Encoding:**

   - [ ] Ćirilica/latinica ispravno prikazana u PDF-u
   - [ ] Specijalni karakteri (%, €, KM) ispravni

3. **Large numbers:**

   - [ ] Kredit od 1,000,000 KM radi
   - [ ] Kredit od 1000 KM radi
   - [ ] Formatiranje brojeva ispravno (zapete/tačke)

4. **Edge cases:**
   - [ ] Kamata 0% radi
   - [ ] Rok 1 mjesec radi
   - [ ] Rok 480 mjeseci radi

---

## 📊 REGRESSION TESTS

Nakon svake izmjene koda, brzo provjerite:

### Quick Smoke Test (5 minuta)

- [ ] Backend pokrenut
- [ ] Frontend pokrenut
- [ ] Osnovni izračun radi
- [ ] Graf prikazan
- [ ] PDF download radi

### Full Regression (30 minuta)

- [ ] Svi testovi iz gore navedenih scenarija
- [ ] Sve napredne funkcije
- [ ] Svi exporti
- [ ] Uporedba

---

## ✅ FINAL CHECKLIST PRE-DEPLOYMENT

### Code Quality

- [ ] Nema console.log() u production kodu
- [ ] Nema TODO komentara
- [ ] Svi fajlovi formatirani
- [ ] Nema unused imports

### Documentation

- [ ] README.md ažuriran
- [ ] API dokumentacija potpuna
- [ ] Komentari u kodu gdje je potrebno

### Build

- [ ] `npm run build` uspješan
- [ ] Build folder generisan
- [ ] Build size razuman (< 1MB)

### Security

- [ ] Nema hardcoded secrets
- [ ] CORS konfigurisan za production
- [ ] Input validation na mjestu

---

## 📝 TEST RESULTS TEMPLATE

```
Test Date: _______________
Tester: __________________
Environment: ☐ Dev  ☐ Staging  ☐ Production

Total Tests: _____ / _____
Passed: ☐☐☐☐☐
Failed: ☐☐☐☐☐

Critical Issues: _____
Major Issues: _____
Minor Issues: _____

Overall Status: ☐ PASS  ☐ FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

---

**Po završetku testiranja, aplikacija je spremna za deployment! 🚀**

**Za automatizovano testiranje:** Razmotrite dodavanje Jest (frontend) i pytest (backend) testova.
