# 🏗️ ANEMIA RESEARCH APP - COMPLETE SETUP GUIDE

## Project Architecture

```
anemia-research-app/
├── frontend/
│   ├── app.json
│   ├── package.json
│   └── src/
│       ├── screens/
│       │   ├── AuthScreen.js
│       │   ├── WizardScreen.js
│       │   ├── SummaryScreen.js
│       │   └── PDFExportScreen.js
│       ├── components/
│       │   ├── ProgressBar.js
│       │   ├── StepCard.js
│       │   ├── ChipSelector.js
│       │   └── FormField.js
│       ├── services/
│       │   ├── supabaseClient.js
│       │   ├── authService.js
│       │   └── patientService.js
│       ├── utils/
│       │   ├── calculations.js
│       │   ├── validators.js
│       │   └── pdfGenerator.js
│       ├── styles/
│       │   └── theme.js
│       └── App.js
└── backend/
    ├── supabase/
    │   └── migrations/ (SQL files)
    └── README.md
```

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Mobile Framework** | React Native | 0.73+ |
| **Backend** | Supabase (PostgreSQL) | - |
| **PDF Generation** | react-native-pdf-lib | Latest |
| **Form State** | React Context + Hooks | - |
| **Authentication** | Supabase Auth | - |

## Prerequisites

```bash
# 1. Node.js & npm
node -v  # Should be 18+
npm -v

# 2. Expo CLI
npm install -g expo-cli

# 3. Git
git --version
```

## Installation Steps

### Step 1: Create React Native Project

```bash
cd ~/anemia-research-app
npx create-expo-app frontend
cd frontend
npm install
```

### Step 2: Install Dependencies

```bash
npm install \
  @supabase/supabase-js \
  @react-native-async-storage/async-storage \
  react-native-svg \
  react-native-pdf-lib \
  react-native-share \
  react-native-file-access \
  axios \
  date-fns \
  expo-permissions \
  expo-document-picker
```

### Step 3: Configure Supabase

1. Go to https://supabase.com
2. Create new project
3. Get your **PROJECT_URL** and **ANON_KEY**
4. Create `.env` file in `frontend/`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Run Development Server

```bash
cd frontend
npm start

# Choose 'w' for web preview or scan QR code with Expo app
```

## Next Steps

→ Execute Supabase SQL migrations
→ Implement authentication
→ Build wizard components
→ Deploy to EAS (Expo Application Services)
