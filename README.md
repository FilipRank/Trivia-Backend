# Trivia Game Project

This is a full-stack web application where users can play trivia games to earn coins and purchase badges. The application features GitHub authentication, allowing users to log in with their GitHub accounts. Users can test their knowledge through trivia questions while earning virtual currency, which they can then spend on collecting various badges.

## 0. Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally
- GitHub OAuth application credentials

### Setup Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd trivia-project
```

2. Set up the backend:
```bash
cd trivia-backend
pnpm install
```

Create a `.env` file in the trivia-backend directory with the following content:
```env
MONGO_URI=mongodb://localhost:27017/trivia-db
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

3. Start the backend server:
```bash
pnpm run dev
```
The backend server will start on http://localhost:4000

4. Set up the frontend:
```bash
cd ../trivia-frontend
pnpm install
pnpm run dev
```
The frontend development server will start on http://localhost:5173

## 1. Database

The project uses MongoDB as its database system, running locally. MongoDB was chosen for its flexibility with JSON-like documents and its excellent integration with Node.js applications.

The database consists of two main collections:

1. **Users Collection**:
```javascript
const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  imageUrl: String,
  balance: Number,
  purchasedBadgesIDs: []
}, { timestamps: true })
```

The User Schema defines the structure of user documents in MongoDB. The githubId field stores the unique identifier obtained from GitHub OAuth authentication. The username field contains the user's GitHub username, while imageUrl stores their GitHub profile picture URL. The balance field tracks the user's virtual currency for purchasing badges. The purchasedBadgesIDs array maintains a list of badges owned by the user. The timestamps option automatically adds createdAt and updatedAt fields to track document modifications.

2. **Badges Collection** - Stores available badges that users can purchase

## 2. Front-end

### Technology Stack
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Key Packages**:
  - React Router for navigation
  - TypeScript for type safety
  - CSS Modules for styling

### Directory Structure
```
trivia-frontend/
├── public/
│   ├── burger-icon.svg
│   ├── github-logo.png
│   ├── logo.svg
│   └── vite.svg
├── src/
│   ├── components/     # Reusable UI components (buttons, cards, etc.)
│   ├── pages/          # Route-level components representing different views
│   ├── services/       # API calls and business logic
│   ├── types/          # TypeScript type definitions and interfaces
│   ├── App.css         # Global styles
│   ├── App.tsx         # Main layout component with navigation
│   ├── main.tsx        # Application entry point with routing setup
│   └── vite-env.d.ts
├── package.json
└── vite.config.ts
```

### Code Examples

Application Routing Setup:
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

This code sets up the application's routing structure using React Router, defining the main layout (App) and nested routes for the home page, user profile, and badge shop pages. The routing configuration demonstrates how different components are organized and accessed within the application.

## 3. Back-end

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Passport.js with GitHub strategy
- **Database**: Mongoose (MongoDB ODM)

### Directory Structure
```
trivia-backend/
├── public/
│   └── badges/
├── src/
│   ├── config/         # Configuration files for database, authentication, and middleware setup
│   │   ├── connectDB.js
│   │   ├── corsConfig.js
│   │   ├── passport.js
│   │   └── sessionConfig.js
│   ├── middlewares/    # Custom middleware functions for request processing and authentication
│   ├── models/         # MongoDB schema definitions and models
│   │   └── User.js
│   ├── routes/         # API endpoint definitions and route handlers
│   │   ├── authRouter.js
│   │   ├── badgeRouter.js
│   │   └── userRouter.js
│   └── index.js        # Application entry point that initializes Express server and middleware
└── package.json
```

### Code Examples

Passport GitHub Authentication:
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

This code configures GitHub OAuth authentication using Passport.js with client credentials and callback URL. When a user logs in, it checks if they exist in the database and creates a new account if needed, storing their GitHub profile information.

Server Setup:
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

This is the main server configuration file that sets up Express middleware components and routes. It configures session management, authentication, CORS, and JSON parsing while defining routes for authentication, user operations, and badge functionality.