# Trivia Igra Projekat

Ovo je full-stack web aplikacija gde korisnici mogu igrati kviz igre kako bi zaradili novčiće i kupovali bedževe. Aplikacija koristi GitHub autentifikaciju, omogućavajući korisnicima da se prijave svojim GitHub nalozima. Korisnici mogu testirati svoje znanje kroz kviz pitanja dok zarađuju virtualnu valutu, koju zatim mogu potrošiti na sakupljanje različitih bedževa.

## 0. Instalacija

### Preduslovi
- Node.js (v14 ili noviji)
- MongoDB instaliran lokalno
- GitHub OAuth kredencijali aplikacije

### Koraci za podešavanje

1. Klonirajte repozitorijum:
```bash
git clone <repository-url>
cd trivia-project
```

2. Podesite backend:
```bash
cd trivia-backend
pnpm install
```

Kreirajte `.env` fajl u trivia-backend direktorijumu sa sledećim sadržajem:
```env
MONGO_URI=mongodb://localhost:27017/trivia-db
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

3. Pokrenite backend server:
```bash
pnpm run dev
```
Backend server će se pokrenuti na http://localhost:4000

4. Podesite frontend:
```bash
cd ../trivia-frontend
pnpm install
pnpm run dev
```
Frontend razvojni server će se pokrenuti na http://localhost:5173

## 1. Baza podataka

Projekat koristi MongoDB kao sistem baze podataka, koji radi lokalno. MongoDB je izabran zbog svoje fleksibilnosti sa JSON-like dokumentima i odlične integracije sa Node.js aplikacijama.

Baza podataka se sastoji od dve glavne kolekcije:

1. **Kolekcija korisnika**:
```javascript
const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  imageUrl: String,
  balance: Number,
  purchasedBadgesIDs: []
}, { timestamps: true })
```

Šema korisnika definiše strukturu korisničkih dokumenata u MongoDB-u. Polje githubId čuva jedinstveni identifikator dobijen od GitHub OAuth autentifikacije. Polje username sadrži GitHub korisničko ime, dok imageUrl čuva URL korisnikove GitHub profilne slike. Polje balance prati korisnikovu virtualnu valutu za kupovinu bedževa. Niz purchasedBadgesIDs održava listu bedževa koje korisnik poseduje. Opcija timestamps automatski dodaje polja createdAt i updatedAt za praćenje modifikacija dokumenta.

2. **Kolekcija bedževa** - Čuva dostupne bedževe koje korisnici mogu kupiti

## 2. Front-end

### Tehnološki Stack
- **Framework**: React sa TypeScript-om
- **Build alat**: Vite
- **Ključni paketi**:
  - React Router za navigaciju
  - TypeScript za tipsku sigurnost
  - CSS Modules za stilizovanje

### Struktura direktorijuma
```
trivia-frontend/
├── public/
│   ├── burger-icon.svg
│   ├── github-logo.png
│   ├── logo.svg
│   └── vite.svg
├── src/
│   ├── components/     # Komponente za višekratnu upotrebu (dugmad, kartice, itd.)
│   ├── pages/          # Komponente na nivou ruta koje predstavljaju različite prikaze
│   ├── services/       # API pozivi i poslovna logika
│   ├── types/          # TypeScript definicije tipova i interfejsi
│   ├── App.css         # Globalni stilovi
│   ├── App.tsx         # Glavna layout komponenta sa navigacijom
│   ├── main.tsx        # Ulazna tačka aplikacije sa podešavanjem rutiranja
│   └── vite-env.d.ts
├── package.json
└── vite.config.ts
```

### Primeri koda

Podešavanje rutiranja aplikacije:
```typescript
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Shop from './pages/Shop'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="shop" element={<Shop />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
```

Ovaj kod postavlja strukturu rutiranja aplikacije koristeći React Router, definišući glavni izgled (App) i ugnežđene rute za početnu stranicu, korisnički profil i prodavnicu bedževa. Konfiguracija rutiranja pokazuje kako su različite komponente organizovane i kako im se pristupa unutar aplikacije.

## 3. Back-end

### Tehnološki Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Autentifikacija**: Passport.js sa GitHub strategijom
- **Baza podataka**: Mongoose (MongoDB ODM)

### Struktura direktorijuma
```
trivia-backend/
├── public/
│   └── badges/
├── src/
│   ├── config/         # Konfiguracioni fajlovi za bazu podataka, autentifikaciju i podešavanje middleware-a
│   │   ├── connectDB.js
│   │   ├── corsConfig.js
│   │   ├── passport.js
│   │   └── sessionConfig.js
│   ├── middlewares/    # Prilagođene middleware funkcije za obradu zahteva i autentifikaciju
│   ├── models/         # MongoDB definicije šema i modeli
│   │   └── User.js
│   ├── routes/         # Definicije API endpointa i handleri ruta
│   │   ├── authRouter.js
│   │   ├── badgeRouter.js
│   │   └── userRouter.js
│   └── index.js        # Ulazna tačka aplikacije koja inicijalizuje Express server i middleware
└── package.json
```

### Primeri koda

Passport GitHub autentifikacija:
```javascript
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:4000/auth/github/callback"
}, 
async function(accessToken, refreshToken, profile, done) {
  try {
    let user = await User.findOne({ githubId: profile.id })
    if (!user) {
      user = await User.create({ 
        githubId: profile.id, 
        username: profile.username,
        imageUrl: profile._json.avatar_url,
        balance: 0
      })
    }
    return done(null, user)
  }
  catch (err) {
    return done(err, null)
  }
}))
```

Ovaj kod konfiguriše GitHub OAuth autentifikaciju koristeći Passport.js sa kredencijalima klijenta i callback URL-om. Kada se korisnik prijavi, proverava se da li postoji u bazi podataka i kreira se novi nalog ako je potrebno, čuvajući informacije njihovog GitHub profila.

Podešavanje servera:
```javascript
const app = express()
const port = 4000

app.use(express.static('public'))
app.use(sessionConfig)
app.use(passport.initialize())
app.use(passport.session())
app.use(corsConfig)
app.use(json())

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/badges', badgeRouter)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
```

Ovo je glavna konfiguraciona datoteka servera koja postavlja Express middleware komponente i rute. Konfiguriše upravljanje sesijama, autentifikaciju, CORS i JSON parsiranje, dok definiše rute za autentifikaciju, korisničke operacije i funkcionalnost bedževa.