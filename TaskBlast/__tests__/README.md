# TaskBlast Test Suite Documentation

This directory contains comprehensive test cases for the TaskBlast application. All tests are written using Jest and React Native Testing Library.

## Testing Methodology

This test suite employs both **Black Box Testing** and **White Box Testing** approaches:

### Black Box Testing

Tests the application from a user's perspective without knowledge of internal implementation. Focuses on:

- User interface interactions
- Input/output validation
- User workflows and navigation
- Expected behaviors from user actions

### White Box Testing

Tests the internal structures and logic of the application with knowledge of the code. Focuses on:

- State management and updates
- Internal function calls (Firebase, AsyncStorage)
- Error handling and edge cases
- Code paths and conditional logic
- Data flow and transformations

---

## Test Files Overview

### 1. Login.test.tsx

**Testing Type:** 🔲 Black Box + ⬜ White Box (Hybrid)

Tests for the login process and authentication flow (includes Google Sign-In).

**Test Categories:**

- **UI Rendering** (🔲 Black Box): Validates all login screen elements are present
- **Valid Login** (🔲 Black Box): Tests successful login with valid credentials
- **Bypass Login** (⬜ White Box): Tests admin bypass functionality (admin/taskblaster)
- **Invalid Login** (🔲 Black Box + ⬜ White Box): Tests error handling for invalid credentials
- **Navigation** (🔲 Black Box): Tests navigation to Forgot Password and Sign Up flows
- **Input Validation** (🔲 Black Box): Tests email format and password masking

**Key Test Cases:**

- ✓ 🔲 Render login screen with username, password, and submit button
- ✓ 🔲 Successfully login with valid Firebase credentials
- ✓ ⬜ Bypass login with admin/taskblaster (case-insensitive)
- ✓ 🔲 Handle empty username/password validation
- ✓ ⬜ Handle Firebase authentication errors (invalid-credential, user-not-found)
- ✓ 🔲 Trim whitespace from inputs
- ✓ 🔲 Navigate to Forgot Password screen
- ✓ 🔲 Navigate to Sign Up flow

---

### 2. Logout.test.tsx

**Testing Type:** 🔲 Black Box + ⬜ White Box (Hybrid)

Tests for logout functionality and session cleanup.

**Test Categories:**

- **Settings Modal Logout** (🔲 Black Box): Tests logout button in settings modal
- **Session Cleanup** (⬜ White Box): Tests clearing user data, AsyncStorage, and stopping background music
- **Error Handling** (⬜ White Box): Tests error scenarios during logout
- **Logout Confirmation** (🔲 Black Box): Tests confirmation dialog (Alert)
- **State Reset** (⬜ White Box): Tests resetting user-specific state (rocks, fuel)

**Key Test Cases:**

- ✓ 🔲 Display logout option in settings modal
- ✓ ⬜ Call Firebase signOut when logout is pressed
- ✓ ⬜ Navigate to login screen after successful logout (router.replace)
- ✓ ⬜ Clear user data from AsyncStorage on logout
- ✓ ⬜ Stop playing background music on logout
- ✓ ⬜ Clear game score on logout
- ✓ ⬜ Handle logout error gracefully
- ✓ ⬜ Remain on home screen if logout fails
- ✓ 🔲 Show confirmation dialog before logout (Alert.alert)
- ✓ 🔲 Cancel logout on confirmation decline
- ✓ 🔲 Proceed with logout on confirmation accept
- ✓ ⬜ Reset all user-specific state on logout

---

### 3. ForgotPassword.test.tsx

**Testing Type:** 🔲 Black Box + ⬜ White Box (Hybrid)

Tests for the forgot password flow with email verification link (NOT PIN-based).

**Test Categories:**

- **Email Submission Screen** (🔲 Black Box): Tests email input and validation
- **Email Validation** (🔲 Black Box): Tests email format validation
- **Email Verification Link** (⬜ White Box): Tests sending reset email via Firebase (not PIN)
- **Password Reset Screen** (🔲 Black Box): Tests password reset form
- **Navigation Flow** (🔲 Black Box): Tests navigation between screens
- **Error Handling** (⬜ White Box): Tests network and Firebase errors

**Key Test Cases:**

- ✓ 🔲 Render forgot password screen with email input
- ✓ 🔲 Accept valid email format
- ✓ 🔲 Reject empty or invalid email
- ✓ 🔲 Trim whitespace from email
- ✓ ⬜ Send password reset email via Firebase (sendPasswordResetEmail)
- ✓ 🔲 Display success message after sending email
- ✓ 🔲 Show instruction to check email for reset link
- ✓ ⬜ Handle user-not-found error
- ✓ 🔲 Allow resending reset email
- ✓ 🔲 Validate password match on reset screen
- ✓ 🔲 Enforce minimum password length (8 characters)
- ✓ 🔲 Mask password inputs
- ✓ 🔲 Navigate back to login after reset
- ✓ ⬜ Handle network errors and too-many-requests

**Note:** Email verification uses a link sent via email, NOT a PIN code.

---

### 4. SignUp.test.tsx

**Testing Type:** 🔲 Black Box + ⬜ White Box (Hybrid)

Tests for the complete sign-up process with email verification via link.

**Test Categories:**

- **Step 1: Birthdate Input** (🔲 Black Box): Tests age validation (COPPA compliance - 13+ years)
- **Step 2: Account Type** (🔲 Black Box): Tests managed vs independent account selection
- **Step 3: Manager PIN** (🔲 Black Box): Tests PIN input for managed accounts
- **Step 4: Name Input** (🔲 Black Box): Tests first and last name validation
- **Step 5: Email Input** (🔲 Black Box): Tests email validation
- **Step 6: Email Verification Link** (⬜ White Box): Tests email verification (NOT PIN)
- **Step 7: Password Creation** (🔲 Black Box): Tests password validation and matching
- **Complete Sign Up Flow** (⬜ White Box): Tests Firebase account creation
- **Navigation Between Steps** (🔲 Black Box): Tests back navigation

**Key Test Cases:**

- ✓ 🔲 Accept valid birthdate (13+ years old)
- ✓ 🔲 Reject birthdate under 13 years (COPPA compliance)
- ✓ 🔲 Display message for underage users to give device to parent/guardian
- ✓ 🔲 Validate date format (MM/DD/YYYY)
- ✓ 🔲 Select managed or independent account type
- ✓ 🔲 Require account type selection
- ✓ 🔲 Accept 4-digit manager PIN for managed accounts
- ✓ 🔲 Only accept numeric input for PIN
- ✓ 🔲 Require both first and last names
- ✓ 🔲 Trim whitespace from names
- ✓ 🔲 Validate email format
- ✓ ⬜ Send verification email via Firebase (sendEmailVerification)
- ✓ 🔲 Show message about clicking email verification link
- ✓ 🔲 Allow resending verification email
- ✓ 🔲 Validate password match (password and confirm password)
- ✓ 🔲 Enforce minimum password length (8 characters)
- ✓ 🔲 Mask password inputs
- ✓ ⬜ Create user account with Firebase (createUserWithEmailAndPassword)
- ✓ ⬜ Save user data to Firestore
- ✓ 🔲 Navigate to home screen after successful signup
- ✓ ⬜ Handle email-already-in-use error
- ✓ 🔲 Allow back navigation with data preservation

**Note:** Email verification uses a link sent via email, NOT a PIN code entry.

---

### 5. HomeScreen.test.tsx

**Testing Type:** 🔲 Black Box + ⬜ White Box (Hybrid)

Tests for the main home screen functionality.

**Test Categories:**

- **UI Rendering** (🔲 Black Box): Tests all UI elements (profile, settings, fuel, rocks, task list, planet image)
- **Navigation** (🔲 Black Box): Tests navigation to different screens (Pomodoro, Profile)
- **Background Music** (⬜ White Box): Tests music playback, looping, and lifecycle management
- **Score Persistence** (⬜ White Box): Tests loading and saving score from AsyncStorage
- **Task List Modal** (🔲 Black Box): Tests task modal open/close functionality
- **Settings Modal** (🔲 Black Box): Tests settings modal open/close functionality
- **Fuel System** (🔲 Black Box): Tests fuel display and icon
- **Error Handling** (⬜ White Box): Tests error scenarios for AsyncStorage and audio player
- **App State Management** (⬜ White Box): Tests background/foreground handling and score reloading

**Key Test Cases:**

- ✓ 🔲 Render Take Off button, fuel indicator, rocks count
- ✓ 🔲 Display rocks in 4-digit format with leading zeros (e.g., "0005")
- ✓ 🔲 Render profile, settings, and task buttons
- ✓ 🔲 Render planet image
- ✓ 🔲 Navigate to Pomodoro Screen when Take Off is pressed
- ✓ 🔲 Navigate to Profile Screen when profile button is pressed
- ✓ 🔲 Open settings modal when settings button is pressed
- ✓ 🔲 Open task list modal when task button is pressed
- ✓ 🔲 Close task list modal
- ✓ 🔲 Close settings modal
- ✓ 🔲 Display task list in modal
- ✓ 🔲 Display settings options in modal
- ✓ ⬜ Play background music on mount (homeScreenMusic.mp3)
- ✓ ⬜ Set music to loop automatically
- ✓ ⬜ Pause music when app goes to background
- ✓ ⬜ Resume music when app becomes active
- ✓ ⬜ Pause music when screen loses focus
- ✓ ⬜ Load score from AsyncStorage on mount
- ✓ ⬜ Default to 0000 if no score exists
- ✓ ⬜ Handle invalid score gracefully (default to 0000)
- ✓ ⬜ Reload score when screen comes into focus
- ✓ ⬜ Floor score to integer
- ✓ ⬜ Handle negative scores as zero
- ✓ 🔲 Display fuel level (20/20)
- ✓ 🔲 Display fuel icon
- ✓ ⬜ Handle AsyncStorage errors gracefully
- ✓ ⬜ Handle audio player errors gracefully
- ✓ ⬜ Reload score when app becomes active

---

### 6. ProfileScreen.test.tsx

⚠️ **Note:** Test file not yet created. ProfileScreen was recently added and needs test coverage.

**Testing Type:** 🔲 Black Box (Recommended)

**Expected Test Categories:**

- **UI Rendering** (🔲 Black Box): Tests profile display, traits, and awards
- **Navigation** (🔲 Black Box): Tests back button and edit profile functionality
- **User Data Display** (🔲 Black Box): Tests name, profile image, traits, and awards rendering
- **Logout Integration** (🔲 Black Box): Tests logout button (redirects to ProfileScreen logout flow)
- **ScrollView** (🔲 Black Box): Tests scrolling functionality for long lists

**Suggested Test Cases:**

- ✓ Render user name centered at top
- ✓ Render profile image with purple gradient
- ✓ Render edit profile button
- ✓ Render traits container with badges
- ✓ Render awards container with badges
- ✓ Render logout button using MainButton component
- ✓ Navigate back to HomeScreen when back button is pressed
- ✓ Display all user traits as badges
- ✓ Display all user awards as badges
- ✓ Handle empty traits gracefully
- ✓ Handle empty awards gracefully
- ✓ Navigate to Login when logout is pressed
- ✓ ScrollView allows scrolling through content
- ✓ Edit profile button triggers edit functionality

---

### 7. PomodoroScreen.test.tsx

**Testing Type:** 🔲 Black Box + ⬜ White Box (Hybrid)

Tests for the Pomodoro timer screen.

**Test Categories:**

- **UI Rendering** (🔲 Black Box): Tests timer display, progress bar, spaceship
- **Timer Countdown** (⬜ White Box): Tests countdown from 1 minute
- **Progress Bar** (🔲 Black Box): Tests progress visualization
- **Pause/Resume Functionality** (🔲 Black Box): Tests pause and resume
- **Background Music** (⬜ White Box): Tests music playback
- **Timer Completion** (🔲 Black Box): Tests navigation to game on completion
- **App State Handling** (⬜ White Box): Tests background/foreground behavior
- **Spaceship Animation** (🔲 Black Box): Tests floating animation
- **Background Scrolling** (🔲 Black Box): Tests scrolling stars background
- **Error Handling** (⬜ White Box): Tests error scenarios
- **Time Formatting** (⬜ White Box): Tests MM:SS format

**Key Test Cases:**

- ✓ 🔲 Display initial time (01:00)
- ✓ 🔲 Render progress bar
- ✓ 🔲 Render animated spaceship
- ✓ 🔲 Render Pause button initially
- ✓ ⬜ Countdown from 1 minute
- ✓ ⬜ Format time correctly (MM:SS)
- ✓ ⬜ Countdown to zero (00:00)
- ✓ ⬜ Update every second
- ✓ 🔲 Progress bar starts at 100%
- ✓ 🔲 Progress decreases as time passes
- ✓ 🔲 Progress reaches 0% when timer completes
- ✓ 🔲 Pause timer when pause button is pressed
- ✓ 🔲 Change button to "Land" when paused
- ✓ ⬜ Pause music when paused
- ✓ 🔲 Navigate back to home when Land is pressed
- ✓ ⬜ Play background music on mount
- ✓ ⬜ Pause music when timer completes
- ✓ 🔲 Navigate to Game screen when timer reaches zero
- ✓ ⬜ Stop timer at zero
- ✓ ⬜ Pause timer when app goes to background
- ✓ ⬜ Pause timer when app becomes inactive
- ✓ 🔲 Apply floating animation to spaceship
- ✓ 🔲 Continuously scroll background
- ✓ ⬜ Handle navigation errors gracefully
- ✓ ⬜ Format single digit seconds with leading zero
- ✓ ⬜ Format single digit minutes with leading zero

---

### 8. GamePage.test.tsx

**Testing Type:** 🔲 Black Box + ⬜ White Box (Hybrid)

Tests for the embedded game screen.

**Test Categories:**

- **UI Rendering** (🔲 Black Box): Tests WebView and loading states
- **Navigation** (🔲 Black Box): Tests back button functionality
- **Loading States** (🔲 Black Box): Tests loading indicator
- **Score Updates** (⬜ White Box): Tests receiving score from game
- **Message Handling** (⬜ White Box): Tests WebView message handling
- **WebView Configuration** (⬜ White Box): Tests WebView settings
- **Error Handling** (⬜ White Box): Tests WebView errors
- **Game Integration** (🔲 Black Box): Tests game loading
- **Performance** (⬜ White Box): Tests rapid updates
- **Safe Area** (🔲 Black Box): Tests safe area rendering
- **Header** (🔲 Black Box): Tests header rendering

**Key Test Cases:**

- ✓ 🔲 Render game page with WebView
- ✓ 🔲 Render back button
- ✓ 🔲 Show loading indicator initially
- ✓ 🔲 Load correct game URL (https://krypto-cs.github.io/SpaceShooter/)
- ✓ 🔲 Navigate back when back button is pressed
- ✓ 🔲 Show loading indicator while WebView loads
- ✓ 🔲 Hide loading indicator after WebView loads
- ✓ ⬜ Handle score update messages from game
- ✓ ⬜ Persist score to AsyncStorage
- ✓ ⬜ Handle multiple score updates
- ✓ ⬜ Handle zero score
- ✓ ⬜ Handle negative scores as zero
- ✓ ⬜ Handle invalid JSON messages gracefully
- ✓ ⬜ Handle non-score messages (log only)
- ✓ ⬜ Enable JavaScript in WebView
- ✓ ⬜ Allow inline media playback
- ✓ ⬜ Not require user action for media playback
- ✓ ⬜ Whitelist all origins for WebView
- ✓ 🔲 Display message when WebView is not installed
- ✓ ⬜ Handle WebView load errors
- ✓ ⬜ Handle AsyncStorage errors when saving score
- ✓ 🔲 Load Space Shooter game
- ✓ ⬜ Handle rapid score updates
- ✓ 🔲 Render within safe area
- ✓ 🔲 Respect top and bottom safe areas

---

## Running the Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npm test Login.test.tsx
npm test Logout.test.tsx
npm test ForgotPassword.test.tsx
npm test SignUp.test.tsx
npm test HomeScreen.test.tsx
npm test PomodoroScreen.test.tsx
npm test GamePage.test.tsx
# Note: ProfileScreen.test.tsx not yet created
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

---

## Test Configuration

### Required Dependencies

```json
{
  "@testing-library/react-native": "^12.x",
  "@testing-library/jest-native": "^5.x",
  "jest": "^29.x",
  "react-test-renderer": "^19.x"
}
```

### Jest Configuration

Add to `package.json`:

```json
{
  "jest": {
    "preset": "react-native",
    "setupFilesAfterEnv": ["@testing-library/jest-native/extend-expect"],
    "transformIgnorePatterns": [
      "node_modules/(?!(react-native|@react-native|expo|@expo|@unimodules|react-native-webview)/)"
    ]
  }
}
```

---

## Important Notes

### Email Verification

⚠️ **Important:** The email verification process uses **email links**, NOT PIN codes. Tests reflect this:

- `sendEmailVerification()` is used instead of PIN verification
- Users click a link in their email to verify
- No PIN input is required during signup or password reset

### COPPA Compliance

The signup process enforces COPPA compliance:

- Users must be 13+ years old
- Under 13 shows message: "Please give the device to a parent or guardian"

### Bypass Login

For testing purposes, bypass credentials are:

- Username: `admin` (case-insensitive)
- Password: `taskblaster`

### Mocked Dependencies

The following are mocked in tests:

- Firebase Auth (`firebase/auth`)
- Firebase Firestore (`firebase/firestore`)
- AsyncStorage (`@react-native-async-storage/async-storage`)
- Expo Router (`expo-router`)
- Expo Audio (`expo-audio`)
- React Native WebView (`react-native-webview`)

---

## Test Coverage Goals

| Component       | Target Coverage | Status                  |
| --------------- | --------------- | ----------------------- |
| Login Process   | 90%+            | ✅ Implemented          |
| Logout Process  | 90%+            | ✅ Implemented          |
| Forgot Password | 90%+            | ✅ Implemented          |
| Sign Up Process | 90%+            | ✅ Implemented          |
| HomeScreen      | 85%+            | ✅ Implemented          |
| ProfileScreen   | 85%+            | ⚠️ Needs Implementation |
| PomodoroScreen  | 85%+            | ✅ Implemented          |
| GamePage        | 85%+            | ✅ Implemented          |
| SettingsModal   | 80%+            | ⚠️ Needs Implementation |
| TaskListModal   | 80%+            | ⚠️ Needs Implementation |

---

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

- GitHub Actions
- GitLab CI
- CircleCI
- Jenkins

Example GitHub Actions workflow:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm test -- --coverage
```

---

## Contributing

When adding new tests:

1. Follow existing test structure
2. Group tests by category using `describe` blocks
3. Use descriptive test names starting with "should"
4. Mock external dependencies
5. Clean up after each test with `beforeEach` and `afterEach`
6. Aim for at least 85% code coverage

---

## Troubleshooting

### Common Issues

**Issue: Tests timeout**

- Solution: Increase Jest timeout in test file: `jest.setTimeout(10000)`

**Issue: Firebase mock not working**

- Solution: Ensure mock is at top of file, before imports

**Issue: AsyncStorage errors**

- Solution: Clear all mocks in `beforeEach`: `jest.clearAllMocks()`

**Issue: Timer tests failing**

- Solution: Use fake timers: `jest.useFakeTimers()`

---

## Test Maintenance

- Review and update tests when features change
- Remove obsolete tests
- Keep mocks up to date with library versions
- Run tests locally before pushing
- Monitor CI/CD test results

---

## Recent Features Added (Need Test Coverage)

The following features have been recently added and require test coverage:

### ProfileScreen

- **Location**: `app/pages/ProfileScreen.tsx`
- **Features**: User profile display, traits badges, awards badges, edit profile, logout
- **Test File Needed**: `__tests__/ProfileScreen.test.tsx`

### SettingsModal

- **Location**: `app/components/SettingsModal.tsx`
- **Features**: Sound effects toggle, music toggle, notifications toggle, dark mode toggle, account settings, privacy, help & support, about
- **Test File Needed**: `__tests__/SettingsModal.test.tsx`

### Background Music on HomeScreen

- **Feature**: Looping background music (homeScreenMusic.mp3)
- **Status**: ✅ Already tested in HomeScreen.test.tsx

---

For questions or issues with tests, please contact the development team.
