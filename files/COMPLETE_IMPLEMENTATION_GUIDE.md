# 🏥 ANEMIA RESEARCH APP - COMPLETE IMPLEMENTATION GUIDE

## 📋 TABLE OF CONTENTS

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Detailed Implementation Steps](#detailed-implementation-steps)
4. [Frontend-Backend Integration](#frontend-backend-integration)
5. [PDF Generation & Export](#pdf-generation--export)
6. [Mobile Deployment](#mobile-deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 QUICK START

### Prerequisites
```bash
# Check Node.js version (18+ required)
node -v
npm -v

# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI for app building
npm install -g eas-cli
```

### 5-Minute Setup
```bash
# 1. Create the project
npx create-expo-app anemia-research-app
cd anemia-research-app

# 2. Install dependencies
npm install @supabase/supabase-js @react-navigation/native @react-navigation/native-stack
npm install react-native-async-storage/async-storage react-native-svg react-native-pdf-lib
npm install react-native-share axios date-fns react-native-file-access

# 3. Copy all provided files to src/ directory

# 4. Create .env file
echo 'SUPABASE_URL=your-url-here' > .env
echo 'SUPABASE_ANON_KEY=your-key-here' >> .env

# 5. Run the app
npm start
# Press 'w' for web preview or scan QR code with Expo app
```

---

## 🏗️ ARCHITECTURE OVERVIEW

### Tech Stack
```
┌─────────────────────────────────────────┐
│      React Native (iOS + Android)       │
│         Expo Framework                  │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼─────────┐  ┌────────▼────────┐
│   Local State   │  │  Async Storage  │
│  (React Hooks)  │  │  (Session Mgmt) │
└─────────────────┘  └─────────────────┘
        │                     │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  Supabase Client    │
        │  REST API + Auth    │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   Supabase Cloud    │
        │  PostgreSQL + Auth  │
        └─────────────────────┘
```

### Data Flow
```
AuthScreen
    ↓
(Login/SignUp) → Supabase Auth → AsyncStorage
    ↓
WizardScreen
    ↓
(Collect Data) → React State → Validation
    ↓
SummaryScreen
    ↓
(Review Data) → Show Badges → Auto-calculations
    ↓
Save to Supabase
    ↓
PDFExportScreen
    ↓
(Generate PDF) → Share/Download
```

---

## 📝 DETAILED IMPLEMENTATION STEPS

### STEP 1: SET UP SUPABASE

#### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Create organization and project
4. Note your **PROJECT_URL** and **ANON_KEY**

#### 1.2 Configure Authentication
1. Go to Authentication → Providers
2. Enable Email provider
3. Set email confirmation required
4. Add redirect URLs:
   - Production: `https://your-app-domain.com/auth`
   - Development: `exp://localhost:19000/auth` (for Expo)

#### 1.3 Execute SQL Schema
1. Go to SQL Editor → New Query
2. Copy entire content from `supabase_schema.sql`
3. Execute the query
4. Verify tables created:
   - `doctors`
   - `patient_records`

#### 1.4 Verify Row Level Security
```sql
-- Check RLS is enabled
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- Result should show both tables
```

---

### STEP 2: SET UP REACT NATIVE PROJECT

#### 2.1 Project Structure
```bash
anemia-research-app/
├── .env                          # Environment variables
├── app.json                      # Expo config
├── package.json
├── src/
│   ├── screens/
│   │   ├── AuthScreen.js
│   │   ├── WizardScreen.js
│   │   ├── SummaryScreen.js
│   │   └── PDFExportScreen.js
│   ├── components/
│   │   └── index.js              # All components
│   ├── services/
│   │   ├── supabaseClient.js
│   │   ├── authService.js
│   │   └── patientService.js
│   ├── utils/
│   │   ├── calculations.js
│   │   └── pdfGenerator.js
│   ├── styles/
│   │   └── theme.js
│   └── App.js                    # Main App component
└── README.md
```

#### 2.2 Environment Configuration
Create `.env` file:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-from-supabase
```

#### 2.3 Update app.json
```json
{
  "expo": {
    "name": "Anemia Research Study",
    "slug": "anemia-research",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#F5F7F6"
    },
    "plugins": [
      ["expo-document-picker"],
      ["expo-file-access"]
    ],
    "scheme": "anemia-research",
    "platforms": ["ios", "android"]
  }
}
```

---

### STEP 3: IMPLEMENT SERVICES

#### 3.1 Supabase Client
```javascript
// src/services/supabaseClient.js
// → Copy from provided supabaseClient.js file
// → Update with your SUPABASE_URL and ANON_KEY
```

#### 3.2 Authentication Service
```javascript
// src/services/authService.js
// Functions:
// - signUpDoctor(email, password, fullName, institution)
// - signInDoctor(email, password)
// - signOutDoctor()
// - getCurrentDoctor()
// - onAuthStateChange(callback)
```

**Key Implementation Points:**
- Store user token in AsyncStorage
- Create doctor profile in `doctors` table
- Listen to auth state changes globally
- Handle email verification flow

#### 3.3 Patient Service
```javascript
// src/services/patientService.js
// Functions:
// - savePatientRecord(doctorId, formData)
// - getPatientRecord(recordId)
// - getDoctorPatientRecords()
// - updatePatientRecord(recordId, updateData)
// - deletePatientRecord(recordId)
```

**Key Implementation Points:**
- Calculate anemia severity before saving
- Calculate eligibility status before saving
- Implement proper error handling
- Use Supabase Row Level Security

#### 3.4 Calculation Utilities
```javascript
// src/utils/calculations.js

// Function: calculateAnemiaSeverity(hemoglobin, gender)
// Returns: { severity, color, description, hb_threshold }
// Rules for Females:
//   - ≥ 12.0: Non-anemic (Green)
//   - 10.0-11.9: Mild (Amber)
//   - 8.0-9.9: Moderate (Orange)
//   - < 8.0: Severe (Red)
// Rules for Males:
//   - ≥ 13.0: Non-anemic
//   - 10.0-12.9: Mild
//   - 8.0-9.9: Moderate
//   - < 8.0: Severe

// Function: calculateEligibilityStatus(criteria)
// Returns: "Included" or "Excluded"
// Logic:
//   Included only if ALL inclusion = TRUE AND ALL exclusion = FALSE
```

---

### STEP 4: BUILD UI COMPONENTS

#### 4.1 Component List
```javascript
// src/components/index.js

// 1. ProgressBar
//    - Shows current step/total steps
//    - Animated progress bar
//    - Mobile-optimized

// 2. FormField
//    - Text input with label
//    - Required indicator
//    - Helper text
//    - Different keyboard types

// 3. ChipSelector
//    - Single-select or multi-select
//    - Horizontal/vertical layout
//    - Selected state styling

// 4. ToggleSwitch
//    - Yes/No switch
//    - Form integration

// 5. Badge
//    - Colored with icon
//    - For anemia severity
//    - For eligibility status

// 6. Card
//    - Rounded container
//    - Shadow effect
//    - Padding

// 7. Button
//    - Primary, secondary, danger variants
//    - Multiple sizes
//    - Loading state
//    - Disabled state
```

#### 4.2 Styling Approach
```javascript
// Use theme.js for ALL styling
import { colors, spacing, typography, borderRadius } from '../styles/theme';

// Example:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,  // Light gray-green
    padding: spacing.md,                  // 16px
  },
  button: {
    backgroundColor: colors.primary,     // Dark Teal
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
});
```

---

### STEP 5: IMPLEMENT SCREENS

#### 5.1 Authentication Flow
```
AuthScreen
├── Sign In Mode
│  ├── Email input
│  ├── Password input
│  ├── "Sign In" button
│  └── Toggle to Sign Up mode
└── Sign Up Mode
   ├── Email input
   ├── Full Name input
   ├── Institution input
   ├── Password input
   ├── Confirm Password input
   ├── "Create Account" button
   └── Toggle to Sign In mode
```

**Implementation Points:**
- Form validation before submission
- Show loading spinner while auth
- Store session in AsyncStorage
- Navigate to Wizard on success
- Show error alerts

#### 5.2 Wizard Flow
```
Step 0: Patient ID & Date
  ↓
Step 1: Eligibility Criteria (auto-calculate status)
  ↓
Step 2: Demographics & Anthropometry
  ↓
Step 3: Medical History & Comorbidities
  ↓
Step 4: Dialysis Parameters
  ↓
Step 5: Laboratory Tests (auto-calculate anemia severity)
  ↓
Step 6: Treatments & Transfusion
  ↓
Next → Save to Supabase → Navigate to Summary
```

**Implementation Points:**
- Validate current step before next
- Show progress bar at top
- Auto-calculate fields on input change
- Show auto-calculated values immediately
- Save to Supabase on "Complete"

#### 5.3 Summary Screen
```
Summary Display
├── Status Badges
│   ├── Eligibility Status Badge
│   └── Anemia Severity Badge
├── All Data Sections
│   ├── Patient ID
│   ├── Eligibility
│   ├── Demographics
│   ├── Medical History
│   ├── Dialysis Parameters
│   ├── Laboratory Results
│   └── Treatments
└── Action Buttons
    ├── Export to PDF
    └── New Record
```

**Implementation Points:**
- Format all data for display
- Color-code severity indicators
- Show doctor name and timestamp
- Enable PDF export button
- Navigate to PDF export on button click

#### 5.4 PDF Export Screen
```
PDF Export Screen
├── Success Message ✓
├── File Information
│   └── File name
├── Sharing Options
│   ├── WhatsApp
│   ├── Email
│   ├── Drive
│   └── More...
├── Privacy Notice
├── Instructions
└── Action Buttons
    ├── Share PDF (native share dialog)
    ├── Download
    ├── View Summary
    └── New Record
```

**Implementation Points:**
- Generate PDF with proper formatting
- Use react-native-pdf-lib or html2pdf
- Implement native share dialog
- Handle file storage
- Provide download option

---

## 🔗 FRONTEND-BACKEND INTEGRATION

### Authentication Flow
```javascript
// 1. User signs up
signUpDoctor(email, password, name, institution)
  ↓
// 2. Supabase creates auth user
// 3. Function creates doctor profile in "doctors" table
// 4. Return user ID to frontend
  ↓
// 5. Frontend stores session in AsyncStorage
// 6. Navigate to Wizard

// On app restart:
onAuthStateChange() listener restores session
  ↓
If user logged in → Show Wizard
If not logged in → Show Auth
```

### Data Save Flow
```javascript
// 1. User completes wizard and clicks "Complete"
handleSave()
  ↓
// 2. Frontend validates all data
// 3. Frontend calculates:
//    - anemia_severity
//    - eligibility_status
  ↓
// 4. Frontend calls savePatientRecord()
savePatientRecord(doctorId, formData)
  ↓
// 5. Supabase INSERT with RLS check
//    - Verify doctor_id matches current user
//    - Insert into patient_records
  ↓
// 6. Trigger runs: calculate timestamp
// 7. Return new record ID
  ↓
// 8. Frontend navigates to Summary
// 9. Show success message
```

### API Endpoints Used
```
POST   /auth/v1/signup                  # Sign up
POST   /auth/v1/token?grant_type=password  # Sign in
POST   /auth/v1/logout                  # Sign out
GET    /auth/v1/user                    # Get current user

POST   /rest/v1/patient_records         # Save record
GET    /rest/v1/patient_records         # Get records
PATCH  /rest/v1/patient_records?id=x    # Update record
DELETE /rest/v1/patient_records?id=x    # Delete record
```

### Error Handling
```javascript
// Handle 401 Unauthorized (invalid token)
if (error.status === 401) {
  // Clear session
  await signOutDoctor()
  // Redirect to Auth
  navigation.replace('Auth')
}

// Handle 403 Forbidden (RLS violation)
if (error.status === 403) {
  Alert.alert('Error', 'Permission denied. Please try again.')
}

// Handle network errors
if (error.code === 'NetworkError') {
  Alert.alert('Error', 'Check your internet connection')
}
```

---

## 📄 PDF GENERATION & EXPORT

### PDF Structure
```
┌─────────────────────────────────────┐
│     ANEMIA RESEARCH STUDY           │
│     Data Collection Report          │
├─────────────────────────────────────┤
│                                     │
│  PATIENT INFORMATION                │
│  - Patient ID                       │
│  - Collection Date                  │
│  - Doctor: [Name]                   │
│  - Status: [Badge]                  │
│                                     │
│  [SECTION 1] DEMOGRAPHICS           │
│  [TABLE] Age, Gender, etc.         │
│                                     │
│  [SECTION 2] ELIGIBILITY            │
│  [TABLE] Criteria status            │
│                                     │
│  ... more sections ...              │
│                                     │
│  Generated: [Date/Time]             │
└─────────────────────────────────────┘
```

### PDF Generation Code
```javascript
// Using react-native-pdf-lib
import { PDFDocument } from '@react-native-pdf-lib/src';

const pdfDocument = PDFDocument.createNew();
pdfDocument
  .addPage('US-Letter')
  .setTextColor(colors.primary)
  .setFont('Helvetica-Bold', 24)
  .drawText('ANEMIA RESEARCH STUDY', 50, 50)
  .setFont('Helvetica', 10)
  .drawText(`Date: ${new Date().toLocaleDateString()}`, 50, 95)
  // ... add more content
  .drawText('Patient Data Summary', 50, 150)
  // ... add sections
  
const pdfFile = await pdfDocument.save();
```

### Sharing PDF
```javascript
// Use react-native-share for native share dialog
import Share from 'react-native-share';

const result = await Share.open({
  url: `file://${filePath}`,
  filename: 'Patient_Report.pdf',
  type: 'application/pdf',
  message: 'Here is the patient data report',
});
```

---

## 📱 MOBILE DEPLOYMENT

### iOS Deployment

#### Step 1: Create Apple Developer Account
- Go to developer.apple.com
- Create team
- Get Team ID

#### Step 2: Build with EAS
```bash
# Configure EAS
eas build --platform ios --local

# Build for TestFlight
eas build --platform ios

# Wait for build to complete (10-20 minutes)

# Download IPA file
# Upload to TestFlight via Apple Connect
```

#### Step 3: App Store Submission
- Create app on App Store Connect
- Fill in app details
- Submit for review
- Wait for approval (1-3 days)

### Android Deployment

#### Step 1: Create Google Play Developer Account
- Go to play.google.com/console
- Create account ($25 one-time fee)

#### Step 2: Build with EAS
```bash
# Build for Google Play
eas build --platform android

# Choose: AAB (recommended) or APK

# Wait for build (5-15 minutes)

# Download AAB file
```

#### Step 3: Play Store Submission
- Create app on Google Play Console
- Upload AAB file
- Fill in store listing
- Submit for review
- Usually approved within 4-24 hours

### App Store Listing
```
App Name: Anemia Research Study
Developer Name: [Your Institution]
Description: 
  Data collection tool for anemia research study in dialysis patients.
  Securely collect and export patient health data.

Screenshots:
  - Auth screen
  - Wizard screen (showing form)
  - Summary screen
  - PDF export screen

Category: Medical
Permissions:
  - Camera (for data entry, optional)
  - Microphone (not needed, disable)
  - Storage (for PDF)
```

---

## 🔧 TROUBLESHOOTING

### Common Issues

#### 1. "Cannot find Supabase URL"
```javascript
// Check .env file exists
// Check variables are correctly set
// Restart development server: npm start
```

#### 2. "401 Unauthorized" errors
```javascript
// Clear AsyncStorage and re-login
await AsyncStorage.removeItem('userToken')

// Check RLS policies in Supabase
SELECT * FROM pg_policies WHERE tablename = 'patient_records';
```

#### 3. PDF not generating
```javascript
// Check react-native-pdf-lib is installed
npm list react-native-pdf-lib

// Check file permissions (Android)
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

#### 4. Share dialog not appearing
```javascript
// Check react-native-share version
npm list react-native-share

// Check plugin in app.json
"plugins": [["react-native-share"]]
```

#### 5. Auto-calculations not working
```javascript
// Check calculations.js is importing correctly
import { calculateAnemiaSeverity } from '../utils/calculations'

// Verify function parameters are correct
const result = calculateAnemiaSeverity(hemoglobinValue, genderString)

// Check return value is not null
if (result) {
  setFormData({...formData, anemia_severity: result.severity})
}
```

### Performance Issues

#### Slow Form Navigation
```javascript
// Use useMemo for expensive calculations
const anemiaSeverity = useMemo(
  () => calculateAnemiaSeverity(hemoglobin, gender),
  [hemoglobin, gender]
)

// Use useCallback for handlers
const handleChange = useCallback((field, value) => {
  setFormData({...formData, [field]: value})
}, [formData])
```

#### Large PDF Files
```javascript
// Compress PDF before sharing
// Use lower DPI for images
// Limit content per page

// Or use server-side generation:
// Frontend sends data → Backend generates PDF → Return URL → Download
```

---

## 📞 SUPPORT

### Resources
- **Supabase Documentation**: https://supabase.com/docs
- **React Native Docs**: https://reactnative.dev/docs/getting-started
- **Expo Documentation**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/docs/getting-started

### Common Solutions
```bash
# Clear cache and rebuild
npm install
npx expo publish

# Reset Expo server
npx expo start --clear

# Check Supabase connection
npx supabase link --project-ref your-project-id

# View Supabase logs
npx supabase logs --follow
```

---

## ✅ DEPLOYMENT CHECKLIST

Before going live:

- [ ] All screens implemented and tested
- [ ] Authentication working (sign up, sign in, sign out)
- [ ] Data collection and validation working
- [ ] Auto-calculations (anemia severity, eligibility) working correctly
- [ ] Data saves to Supabase successfully
- [ ] PDF generation and sharing working
- [ ] Tested on iOS device
- [ ] Tested on Android device
- [ ] Tested with slow internet
- [ ] Privacy policy written and linked
- [ ] Error messages user-friendly
- [ ] Loading states showing properly
- [ ] No console errors or warnings
- [ ] App icon and splash screen added
- [ ] App name and description finalized
- [ ] Support email/contact info added

---

## 🎉 YOU'RE READY!

Your Anemia Research app is now ready to collect patient data efficiently and securely.

**Happy coding!** 🚀

For questions or issues, refer to the resources above or consult with your development team.

---

*Last Updated: August 2026*
*Version: 1.0.0*
