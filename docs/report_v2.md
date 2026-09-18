### Three-Dots Context Menu (`[ ⋮ ]`)
The rightmost button expands a dropdown with two actions:
1. **Profile**: Opens a dedicated full-screen overlay covering the entire viewport, including the Hero Navbar.
2. **Logout**: Invalidates client session tokens, resets application state, and redirects the browser to `/login`.

---

## 3. Screen Specifications & Workflows

### 3.1 Register Screen (`/register`)
The onboarding screen for new users.

- **User Inputs:**
  - Username (Unique, 3–30 chars)
  - Full Name
  - Email Address (Unique, verified format)
  - Mobile Number (Unique, 10 digits)
  - Password
- **Actions:**
  - `Register` button (Submits form data to `POST /api/auth/register`)
  - Redirect button: *"Already have an account? Log In"*
- **Flow:**
  $$\text{User Fills Inputs} \longrightarrow \text{Validation} \longrightarrow \text{Account Created} \longrightarrow \text{Redirect to } /login$$

---

### 3.2 Login Screen (`/login`)
The entry portal for existing users.

- **User Inputs:**
  - Username or Email
  - Password
- **Actions:**
  - `Login` button (Submits to `POST /api/auth/login`)
  - Redirect button: *"Don't have an account? Register"*
- **Flow:**
  $$\text{User Inputs Credentials} \longrightarrow \text{JWT / Session Assigned} \longrightarrow \text{Redirect to } /dashboard$$

---

### 3.3 Dashboard Screen (`/dashboard`)
Informational landing screen post-login displaying dynamic platform metrics and system state.

- **Metrics & Information Displayed:**
  - Total ISL vocabulary entries in Dictionary.
  - Number of structured learning modules available.
  - Number of registered community members.
  - Number of training reference videos hosted.
  - Summary of underlying ML technologies (MediaPipe, TensorFlow.js LSTM, Web Speech API).

---

### 3.4 Translator Screen (`/translator`)
The core computer-vision feature delivering zero-latency real-time sign recognition directly inside the client browser.

- **Controls & Elements:**
  - `Open Camera` button: Prompts browser webcam permission (`navigator.mediaDevices.getUserMedia`).
  - `Start Translation` toggle button: Activates frame landmark processing.
  - Camera Viewport with real-time MediaPipe skeletal/landmark overlay.
  - Prediction Display Card: Renders recognized English word.
  - Text-to-Speech (TTS) Button: Invokes the native browser `window.speechSynthesis` API.
- **Inference Pipeline:**
  $$\text{Webcam Stream} \longrightarrow \text{MediaPipe Landmark Extraction} \longrightarrow \text{Sliding Sequence Buffer (30 Frames)}$$
  $$\longrightarrow \text{Client-Side LSTM (TF.js/ONNX)} \longrightarrow \text{Predicted Sign} \longrightarrow \text{Text-to-Speech Audio Output}$$

---

### 3.5 Dictionary Screen (`/dictionary`) & Sign Detail View

#### Main Search Interface
Searchable directory of verified ISL signs supporting both text-based and speech-based querying.
- **Search Capabilities:**
  - **Typed Search:** Search bar with 300ms debouncing to minimize database queries.
  - **Voice Search:** Microphone button using browser `webkitSpeechRecognition` to transcribe spoken search queries.
- **Search Results Display:**
  - Grid/List of UI Cards showing: `Sign Name`, preview thumbnail, concise definition preview, and provider badge (`Official Organization` vs. `Community Contributor`).
  - Implements pagination or infinite scroll with lazy-loaded media assets.

#### Sign Detail View (Full-Screen Component)
Clicking any dictionary card mounts a full-screen view that covers the entire application window (including the Hero Navbar).
- **Displayed Attributes:**
  - **Sign Name** (e.g., *"Hello"*)
  - **Sign Video** (Cloudinary hosted player with looping & playback speed controls: `0.5x`, `1.0x`)
  - **Meaning** (Linguistic definition of the word)
  - **Usage Context** (Situational usage, e.g., *"Used to greet people in semi-casual contexts..."*)
  - **Attribution Banner**:
    - Organization Source: e.g., *"Created by Organization: ISLRTC"*
    - User Contribution: e.g., *"Contributed by: Rahul@swami"*
  - Close button (`✕`) to return to the search list.

---

### 3.6 Awareness Screen (`/awareness`)
An educational and advocacy portal covering the cultural and historical foundations of Indian Sign Language.

- **Structured Content Sections:**
  - *What is Indian Sign Language (ISL)?*
  - *Linguistic History & Regional Variations in India.*
  - *Standardization Initiatives & ISLRTC's Role.*
  - *Rights of Persons with Disabilities (RPwD) Act & Government Policies.*
  - *Verified External Learning Resources & Community Directories.*

---

### 3.7 Learn ISL Screen (`/learn`) & Dynamic Quiz System

Designed with open access: users can explore any module or sign freely without mandatory lock/unlock constraints.

#### Module Navigation & Sign Study Deck
- Users choose from multiple modules (e.g., *Module 1: Greetings*, *Module 2: Daily Essentials*, *Module 3: Medical Emergencies*).
- **Module View:** Displays all signs inside that module as clean interactive cards.
- Users can click any sign card to inspect its:
  - Video demonstration (Cloudinary URL; nullable if video is not yet recorded).
  - Detailed definition/meaning.
  - Contextual usage information.
- Direct entry: Users can learn at their own pace or immediately proceed to the module assessment.

#### Dynamic LLM-Assisted Assessment Engine
At the bottom of every module, an assessment component allows users to test their comprehension.
- **Mechanism:**
  1. The user clicks **"Start Module Quiz"**.
  2. The backend queries the `LearnSign` collection for all signs belonging to the active module that have valid video links (`videoUrl != null`).
  3. The backend provides these signs to an LLM (Gemini / OpenAI) via a structured prompt.
  4. The LLM returns a structured JSON payload of scenario questions (e.g., *"Rahul is at a hospital with high body temperature. Which sign represents 'Fever'?"*) paired with 4 video choices (A, B, C, D) and an answer key.
  5. The React frontend dynamically renders the scenario card and 4 video players.
  6. When the user selects an option, the system verifies their selection against the generated answer key.
  7. On quiz completion, total score is calculated. If `currentScore > user.moduleScores[moduleNumber].bestScore`, the user's best score is permanently updated in MongoDB and surfaced on their Profile.

---

### 3.8 Contribute Screen (`/contribute`) & Contribution Sub-Component

Enables community members to submit new sign videos and definitions to enrich the dictionary.

#### Guidance Landing Page
- Explains submission requirements:
  - Minimum lighting and camera framing guidelines.
  - Dominant hand positioning.
  - Video duration restriction: **Maximum 8 seconds**.
  - Code of conduct, content rules, and misuse penalties (temporary suspension).
- At the bottom of the page, the user clicks **"Let's Contribute"**.

#### Contribution Application Form (Full-Screen Component)
Opens a dedicated full-screen overlay covering the Hero Navbar with the following form controls:
- **Sign Name** (`String`, Required)
- **Meaning / Definition** (`String`, Required)
- **Usage Context** (`String`, Required)
- **Video Input** (Required):
  - Option A: Upload an existing video file (`.mp4`, `.webm`).
  - Option B: Record directly using the webcam via the browser `MediaRecorder` API.
- **Action**: `Submit Application` button.
- **Submission Pipeline:**
  $$\text{User Submits} \longrightarrow \text{Video Uploads to Cloudinary} \longrightarrow \text{Backend Creates Contribution Record}$$
  $$\longrightarrow \text{Asynchronous LLM Moderation Check} \longrightarrow \text{Record Moves to Moderator Queue}$$
- The user can view their submission's real-time status (`Pending`, `Approved`, or `Rejected`) directly on the main Contribution screen.

---

### 3.9 Profile Screen (`/profile`)
A dedicated full-screen management view covering the entire viewport.

- **User Information:**
  - Avatar / Profile Picture.
  - Username, Full Name, Email ID, and Mobile Number.
  - Edit Profile modal (allows updating personal details).
- **Learning Dashboard:**
  - Displays a clean visual breakdown of all modules.
  - Shows the user's **Personal Best Score** for every module completed.

---

### 3.10 Moderate Screen (`/moderate`)
Restricted exclusively to users with `role === 'moderator'`.

- **Moderation Queue:**
  - Lists all submissions from the `contributions` collection where `status === 'pending'`.
- **Application Review Card:**
  - Submitter metadata: Full Name, Username, Email ID, Mobile Number.
  - Proposed Sign Information: Sign Name, Meaning, Usage Context, and looping Video Player.
  - **Automated LLM Review Summary**: Displays AI pre-analysis highlighting vocabulary validity, potential vulgarity/spam flags, and text coherence.
- **Moderator Actions:**
  1. **Approve**:
     - Automatically migrates the submission to the production `Dictionary` collection.
     - Marks contribution `status = 'approved'`.
  2. **Reject with Feedback**:
     - Marks contribution `status = 'rejected'`.
     - Appends `moderatorFeedback` (advice/reason) visible to the submitter.
  3. **Disciplinary Action (Temporary Restriction)**:
     - Sets the contributor's `User.isBlocked = true` and assigns a `blockDuration` timestamp.

---

## 4. Complete Navigation Flow Diagrams

### 4.1 Standard User Navigation