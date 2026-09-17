# ISL Sanket — Project Folder Structure

## 1. Root Structure

```text
isl-sanket/
├── client/                 # React frontend + browser ML inference
├── server/                 # Node.js + Express + MongoDB backend
├── ml/                     # Python ML training, preprocessing, evaluation
├── README.md
├── .gitignore
└── package.json            # Optional root scripts
```

The project has three main parts:

- `client` — user interface and real-time browser inference
- `server` — authentication, APIs, MongoDB, LLM integration, contributions and moderation
- `ml` — Python code for MediaPipe preprocessing, LSTM training/evaluation and model conversion

---

# 2. Frontend Structure

```text
client/
├── public/
│   ├── models/                     # Converted browser-compatible ML model
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── videos/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── VideoPlayer.jsx
│   │   │
│   │   └── layout/
│   │       ├── Header.jsx
│   │       ├── Navbar.jsx
│   │       └── MoreMenu.jsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   └── auth.service.js
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── StatisticsCard.jsx
│   │   │   │   └── TechnologyInfo.jsx
│   │   │   └── dashboard.service.js
│   │   │
│   │   ├── translator/
│   │   │   ├── components/
│   │   │   │   ├── CameraView.jsx
│   │   │   │   ├── TranslationControls.jsx
│   │   │   │   ├── PredictionDisplay.jsx
│   │   │   │   └── VoiceButton.jsx
│   │   │   ├── ml/
│   │   │   │   ├── loadModel.js
│   │   │   │   ├── handTracking.js
│   │   │   │   ├── preprocessing.js
│   │   │   │   └── prediction.js
│   │   │   └── translator.utils.js
│   │   │
│   │   ├── dictionary/
│   │   │   ├── components/
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── VoiceSearch.jsx
│   │   │   │   ├── SignCard.jsx
│   │   │   │   └── SignList.jsx
│   │   │   ├── pages/
│   │   │   │   └── SignDetail.jsx
│   │   │   └── dictionary.service.js
│   │   │
│   │   ├── awareness/
│   │   │   ├── components/
│   │   │   │   ├── AwarenessSection.jsx
│   │   │   │   └── ResourceCard.jsx
│   │   │   └── awareness.service.js
│   │   │
│   │   ├── learn/
│   │   │   ├── components/
│   │   │   │   ├── ModuleCard.jsx
│   │   │   │   ├── ModuleList.jsx
│   │   │   │   ├── SignLesson.jsx
│   │   │   │   ├── Quiz.jsx
│   │   │   │   ├── QuizQuestion.jsx
│   │   │   │   └── QuizOption.jsx
│   │   │   ├── pages/
│   │   │   │   └── ModuleDetail.jsx
│   │   │   └── learn.service.js
│   │   │
│   │   ├── contribute/
│   │   │   ├── components/
│   │   │   │   ├── ContributionGuidelines.jsx
│   │   │   │   ├── VideoUploader.jsx
│   │   │   │   ├── VideoRecorder.jsx
│   │   │   │   ├── ContributionForm.jsx
│   │   │   │   └── SubmissionStatus.jsx
│   │   │   └── contribute.service.js
│   │   │
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   │   ├── ProfileInfo.jsx
│   │   │   │   ├── EditProfile.jsx
│   │   │   │   └── LearningProgress.jsx
│   │   │   └── profile.service.js
│   │   │
│   │   └── moderate/
│   │       ├── components/
│   │       │   ├── ApplicationList.jsx
│   │       │   ├── ApplicationCard.jsx
│   │       │   ├── ApplicationDetail.jsx
│   │       │   ├── LLMReview.jsx
│   │       │   └── ModerationActions.jsx
│   │       └── moderate.service.js
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Translator.jsx
│   │   ├── Dictionary.jsx
│   │   ├── Awareness.jsx
│   │   ├── Learn.jsx
│   │   ├── Contribute.jsx
│   │   ├── Profile.jsx
│   │   ├── Moderate.jsx
│   │   └── SignDetail.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── UserContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   └── useInfiniteScroll.js
│   │
│   ├── services/
│   │   └── api.js                  # Axios instance + interceptors
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ModeratorRoute.jsx
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
└── vite.config.js
```

## Frontend organization

### `pages/`
Contains the actual application screens/routes.

### `features/`
Contains feature-specific components and logic. This keeps Translator, Dictionary, Learn, Contribution and Moderation code separated.

### `components/common/`
Reusable UI components shared by multiple features.

### `components/layout/`
Application-wide layout components such as the header, navbar and three-dots menu.

### `services/`
The global Axios instance belongs here. Feature-specific API calls can stay inside their feature folders.

### `routes/`
Contains application routing, authentication protection and moderator-only route protection.

---

# 3. Translator ML Structure

```text
features/translator/
├── components/
│   ├── CameraView.jsx
│   ├── TranslationControls.jsx
│   ├── PredictionDisplay.jsx
│   └── VoiceButton.jsx
│
└── ml/
    ├── loadModel.js
    ├── handTracking.js
    ├── preprocessing.js
    └── prediction.js
```

The real-time flow is:

```text
Camera
  ↓
MediaPipe
  ↓
Hand Landmarks
  ↓
Preprocessing
  ↓
Browser LSTM
  ↓
Prediction
  ↓
PredictionDisplay
```

The model runs in the user's browser, so camera frames do not need to be sent to the backend for every prediction.

---

# 4. Backend Structure

```text
server/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   └── cloudinary.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Sign.js
│   │   ├── Module.js
│   │   ├── Quiz.js
│   │   ├── Progress.js
│   │   ├── Contribution.js
│   │   └── Moderation.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── user/
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   └── user.routes.js
│   │   │
│   │   ├── dashboard/
│   │   │   ├── dashboard.controller.js
│   │   │   ├── dashboard.service.js
│   │   │   └── dashboard.routes.js
│   │   │
│   │   ├── dictionary/
│   │   │   ├── dictionary.controller.js
│   │   │   ├── dictionary.service.js
│   │   │   └── dictionary.routes.js
│   │   │
│   │   ├── learn/
│   │   │   ├── learn.controller.js
│   │   │   ├── learn.service.js
│   │   │   └── learn.routes.js
│   │   │
│   │   ├── quiz/
│   │   │   ├── quiz.controller.js
│   │   │   ├── quiz.service.js
│   │   │   └── quiz.routes.js
│   │   │
│   │   ├── contribution/
│   │   │   ├── contribution.controller.js
│   │   │   ├── contribution.service.js
│   │   │   └── contribution.routes.js
│   │   │
│   │   └── moderation/
│   │       ├── moderation.controller.js
│   │       ├── moderation.service.js
│   │       └── moderation.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── integrations/
│   │   └── llm/
│   │       ├── llm.client.js
│   │       └── llm.service.js
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── tokens.js
│   │   ├── cookies.js
│   │   └── helpers.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

## Backend organization

### `config/`
MongoDB, environment and video-storage configuration.

### `models/`
Mongoose models for MongoDB collections.

### `modules/`
Feature-based backend implementation.

Each module normally contains:

```text
controller
service
routes
validation (when required)
```

### `middlewares/`
Authentication, role checking, error handling and file-upload middleware.

### `integrations/`
External services such as the LLM API.

### `routes/`
Combines the individual module routes under the main API router.

---

# 5. ML Development Structure

```text
ml/
├── data/
│   ├── raw/
│   └── processed/
│
├── preprocessing/
│   ├── landmark_extraction.py
│   └── normalization.py
│
├── training/
│   ├── train.py
│   ├── evaluate.py
│   └── model.py
│
├── models/
│   ├── trained/
│   └── converted/
│
├── conversion/
│   └── convert_to_browser_model.py
│
├── testing/
│   └── test_predictions.py
│
├── requirements.txt
└── README.md
```

Python is used for:

- Dataset preprocessing
- MediaPipe/OpenCV processing during ML development
- LSTM training
- Model evaluation
- Model conversion

After conversion, the browser-compatible model is placed in:

```text
client/public/models/
```

Python/FastAPI is therefore not required for the real-time production inference path if browser inference works successfully.

---

# 6. Main Runtime Architecture

```text
                         ISL SANKET
                              │
              ┌───────────────┴────────────────┐
              │                                │
           Browser                         Backend
              │                                │
            React                       Node + Express
              │                                │
       ┌──────┴──────┐                  ┌──────┴──────┐
       │             │                  │             │
  Normal Features Translator         MongoDB       LLM
       │             │
       │          Camera
       │             ↓
       │         MediaPipe
       │             ↓
       │        Preprocessing
       │             ↓
       │       Browser LSTM
       │             ↓
       │         Prediction
       │
       └──────────── API ────────────────┘
```

## Final technology structure

```text
React
  +
MediaPipe
  +
Browser ML Runtime
  +
Node.js
  +
Express.js
  +
MongoDB
  +
Mongoose
  +
Cloudinary/Object Storage
  +
LLM API
  +
Python/TensorFlow for ML development
```

The main architectural principle is:

> **Real-time ISL inference runs in the browser. Normal application features communicate with the Node/Express backend.**
