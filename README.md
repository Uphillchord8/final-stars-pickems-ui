Stars Pick’Em UI
Description
Stars Pick’Em UI is a React single-page application that lets users sign up, log in, and make game-day predictions (first goal, game-winning goal) for Dallas Stars hockey matches. It features:
- Secure authentication with JWT (login, signup, password reset)
- Persistent “remember me” sessions and token refresh
- Leaderboard with top scores and game stats
- Profile page with default pick settings and avatar upload
- Last-game highlights and season stats
Tech Stack
- React 19.x (Create React App)
- React Router v7
- Axios for API calls
- Context API for global auth state
- CSS custom properties (design tokens) in theme.css
- No CSS Modules—every component uses shared utility classes
Getting Started
Prerequisites
- Node.js >= 14.x
- npm >= 6.x or Yarn >= 1.x
- A backend API running at http://localhost:4000 (CRA proxy)
Installation
- Clone the repo
git clone https://github.com/your-org/stars-pickems-ui.git
cd stars-pickems-ui
- Install dependencies
npm install
# or
yarn install
- Create an .env.local in the project root (optional override)
REACT_APP_API_URL=http://localhost:4000


Available Scripts
In the project directory, run:
- npm start
Starts the development server on http://localhost:3000
- npm run build
Bundles the app for production into the build/ folder
- npm test
Launches the test runner (Jest & React Testing Library)
- npm run eject
Note: this is a one-way operation.
Folder Structure
src/
├── assets/            # Images and static media
├── components/        # React components (Pages & UI)
│   ├── ForgotPassword.jsx
│   ├── Leaderboard.jsx
│   ├── Login.jsx
│   ├── Nav.jsx
│   ├── Pickem.jsx
│   ├── Profile.jsx
│   ├── ResetPassword.jsx
│   ├── Signup.jsx
│   └── Stats.jsx
├── context/           # AuthContext for user/session management
│   └── authcontext.jsx
├── styles/            # Global theme (design tokens + utilities)
│   └── theme.css
├── utils/             # API client and helper functions
│   └── api.js
└── App.jsx            # Routes & layout
└── index.js           # App entrypoint


Styling
All visual design lives in src/styles/theme.css:
- Design tokens: color palette, spacing scale, typography
- Utility classes: layout (container, flex-center), spacing (mb-md, p-lg), buttons, form controls
- Component helpers: .card, .table, .avatar, .stat-row, .error-message, etc.
No component-scoped CSS modules remain—every style is driven by the centralized theme.
API
This UI expects a REST API with these endpoints:
- Auth
POST /auth/login
POST /auth/signup
POST /auth/forgot
POST /auth/reset
- Users
GET /players
POST /user/avatar
POST /user/defaults
- Games & Picks
GET /games
POST /picks
- Stats & Leaderboard
GET /leaderboard
GET /stats
Axios is configured in src/utils/api.js to attach the JWT from storage and handle 401s globally.
Contributing
- Fork the repository
- Create a new branch (git checkout -b feature/foo)
- Commit your changes (git commit -m "feat: add foo")
- Push to the branch (git push origin feature/foo)
- Open a Pull Request
Please run npm test and ensure no lint errors before submitting.

Enjoy building your polished, scalable Pick’Em UI! Feel free to open issues or PRs for any further improvements.
