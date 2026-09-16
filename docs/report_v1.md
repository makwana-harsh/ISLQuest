# ISL Sanket — Frontend Screen & Navigation Structure

## 1. Register Page

**Route:** `/register`

This is the first screen for a new user.

### User inputs
- Username
- Password
- Full name
- Email
- Mobile number

### Actions
- **Register** button
- Link/button to go to the Login page

### Flow
```text
User enters registration information
        ↓
Clicks Register
        ↓
Account is created
        ↓
Redirect to Login page
```

---

## 2. Login Page

**Route:** `/login`

This is the screen where an existing user logs into the platform.

### User inputs
- Username
- Password

### Actions
- **Login** button
- Link/button to go to the Register page

### Flow
```text
User enters username + password
        ↓
Clicks Login
        ↓
Authentication succeeds
        ↓
Redirect to Dashboard
```

---

# 3. Main Application Layout

After successful login, the user enters the main application.

The main application layout has two parts:

```text
┌──────────────────────────────────────────────────────────────┐
│                         HEADER / NAVBAR                      │
│  App Icon   Dashboard | Translator | Dictionary | ...   ⋮   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                     CURRENT SCREEN CONTENT                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Header / Hero Navbar

The header remains visible while the user navigates between the six main application screens.

### Header contains
- Web-app icon/logo
- Main navigation bar
- Three-dots menu

### Main navigation options

1. Dashboard
2. Translator
3. Dictionary
4. Awareness
5. Learn ISL
6. Contribute

If the logged-in user has the `moderator` role, an additional navigation option is displayed:

7. Moderate

The navbar is the primary navigation mechanism of the application.

---

## Three-Dots Menu

The three-dots button contains:

- Profile
- Logout

### Profile

Clicking **Profile** opens a separate full-screen Profile page.

The Profile page covers the complete application screen, including the header/navbar.

The user can:

- View personal information
- Edit personal information
- View Learn ISL progress
- View scores/progress related to completed learning modules and assessments

### Logout

Clicking **Logout**:

```text
Logout
  ↓
Session is terminated
  ↓
User is redirected to Login page
```

---

# 4. Dashboard Page

**Route:** `/dashboard`

The Dashboard is the default screen after login.

It does not contain a major interactive feature. Its purpose is to provide information about the ISL Sanket platform.

### Information displayed

- Number of training videos
- Number of supported ISL signs
- Number of users using the platform
- Number of words available in the dictionary
- Technologies used in the project
- Other important project/platform statistics

The Dashboard acts as the informational landing page of the application.

---

# 5. Translator Page

**Route:** `/translator`

The Translator is the main feature of ISL Sanket.

The user can use the camera to perform an ISL sign and receive its predicted English word.

## Main controls

### Open Camera

Opens the user's camera.

### Start Translation

Starts the real-time sign recognition process.

The expected flow is:

```text
User opens camera
        ↓
User clicks Start Translation
        ↓
Camera captures hand movement
        ↓
MediaPipe detects hand landmarks
        ↓
Landmarks are preprocessed
        ↓
LSTM model runs in the user's browser
        ↓
Predicted ISL sign/word is displayed
```

The real-time ML inference runs in the browser to minimize network latency.

### Predicted Word

The predicted English word is displayed clearly to the user.

### Convert Word to Voice

A voice/speaker button converts the predicted word into speech.

```text
Predicted word
      ↓
Voice button
      ↓
Browser text-to-speech
      ↓
Spoken English word
```

---

# 6. Dictionary Page

**Route:** `/dictionary`

The Dictionary contains the available ISL signs/words.

## Main Search Area

The page contains a search bar.

The user can search using:

- Typed text
- Voice input

### Typed Search

```text
User types a word
      ↓
Search is processed
      ↓
Matching signs are displayed
```

### Voice Search

The user clicks the microphone button and speaks a word.

```text
User speaks
    ↓
Speech-to-text
    ↓
Search query
    ↓
Matching signs
```

## Search Results

Matching words/signs are displayed as UI cards.

The results are ordered by similarity/relevance to the searched content.

Each card can contain information such as:

- Word/sign name
- Short description
- Sign preview
- Other relevant basic information

### Clicking a Dictionary Card

Clicking a card opens a separate full-screen Sign Detail page.

The Sign Detail page covers the complete screen, including the header/navbar.

---

## Sign Detail Page

The page displays detailed information about the selected sign.

### Information displayed

- Sign/word name
- Sign video
- Definition
- Meaning
- Origin/source of the video
- Information about the video provider
- Other relevant information

### Video sources

The platform can contain videos from two main sources:

#### Official/Open-source ISL dictionary content

Videos obtained from an open-source/government ISL dictionary are displayed with their source/provider information.

#### User-contributed content

If a user contributes a video that is approved by a moderator, the dictionary can display information about the contributor according to the platform's contribution policy.

---

## Dictionary Performance Features

The Dictionary should use:

- Debouncing for search input
- Pagination/infinite scrolling for large result sets
- Lazy loading for videos and other heavy media
- Efficient search and result loading

These features prevent the application from loading the complete dictionary at once.

---

# 7. Awareness Page

**Route:** `/awareness`

The Awareness section is an educational and informational area about Indian Sign Language.

The content is organized into clear information sections.

### Main topics

- What is ISL?
- History and background
- Regional variations
- Standardization
- Government recognition and initiatives
- ISL-related organizations and resources
- External references
- Educational resources

The page primarily provides information and references rather than interactive functionality.

### Future feature

A feedback form may be added to the Awareness section in a future version.

---

# 8. Learn ISL Page

**Route:** `/learn`

The Learn ISL section teaches users ISL through structured learning modules.

The interface is designed with a game-like learning experience.

## Module List

The user sees multiple learning modules.

Modules are organized progressively, from common/basic signs toward more advanced signs.

Example:

```text
Module 1
Basic Greetings
    ↓
Module 2
Common Daily Words
    ↓
Module 3
Common Situations
    ↓
Module 4
More Advanced Vocabulary
```

The exact module structure can be expanded as more learning content is added.

---

## Module Screen

When the user opens a module, the module contains signs that the user needs to learn.

For each sign, the user can see:

- Sign/word
- Sign video
- Meaning/definition
- Other relevant learning information

The user progresses through the signs in the module.

---

## Module Assessment / Quiz

At the end of a module, the user must complete an assessment.

The quiz uses pre-recorded sign videos as answer options.

Example:

```text
Question:
Rahul is in a hospital and has a fever.
Which sign represents "fever"?

A. [sign video]
B. [sign video]
C. [sign video]
D. [sign video]
```

The user selects one of the video options.

The selected option is checked against the correct answer stored for the question.

The user does not need to perform the sign in front of the camera for the quiz.

### Quiz flow

```text
Complete module
      ↓
Start assessment
      ↓
Read question/scenario
      ↓
Watch video options
      ↓
Select an option
      ↓
Submit answer
      ↓
Answer is verified
      ↓
Score/progress is updated
```

### Progress

The user's learning progress and assessment scores are stored and can be viewed from the Profile page.

---

# 9. Contribute Page

**Route:** `/contribute`

The Contribute section allows users to submit new ISL sign videos and information that are not currently available in the dictionary.

The page first explains the contribution requirements and rules.

## Contribution Guidance

The page contains:

- Video-upload guidance
- Recording advice
- Example of a suitable video
- Content rules
- Restrictions
- Disciplinary actions
- Other submission requirements

Example recording requirements:

- Use a well-lit environment
- Keep the hand/sign clearly visible
- Record a clear and understandable sign
- Maximum video length: 8 seconds
- Follow the platform's content rules

---

## Upload / Record

The user can:

- Upload a video
- Record a video

The user also provides information related to the submitted sign, such as:

- Word/sign name
- Definition
- Description
- Other required information

---

## Submission Flow

```text
User uploads/records video
        ↓
User provides sign information
        ↓
Submit contribution
        ↓
Backend creates contribution application
        ↓
LLM-assisted moderation
        ↓
Application is sent to moderator
        ↓
Moderator verifies application
```

After submission, the user can see the status of the application.

### Status: Pending

The application is waiting for moderation.

### Status: Approved

The moderator has approved the submission.

The approved sign/video is added to the Dictionary.

```text
Approved
   ↓
Sign + information + video
   ↓
Added to Dictionary
```

### Status: Rejected

The application is not approved.

The user can see the reason/action provided by the moderator.

---

# 10. Moderator Role

ISL Sanket has two user roles:

- `user`
- `moderator`

There is no separate admin panel in the initial version because of the project time limit.

Instead, developers manually assign the `moderator` role to a trusted ISL expert or reliable member of the organization by changing the user's role in the database.

The moderator still uses the normal authentication system.

```text
Username
Password
Role = "moderator"
```

After login, the moderator receives the normal application interface and the same header/navbar.

The only difference is that the moderator gets one additional navigation option:

**Moderate**

---

# 11. Moderate Page

**Route:** `/moderate`

The Moderate page is available only to users whose role is `moderator`.

It contains incoming contribution applications submitted by users.

## Moderation Flow

User contribution does not go directly to the moderator.

The application first passes through an LLM-assisted moderation layer.

```text
User Contribution
       ↓
Backend
       ↓
LLM Moderation Layer
       ↓
AI Review
       ↓
Moderator
       ↓
Final Decision
```

---

## LLM-Assisted Review

The LLM reviews the available submission information.

Depending on feasibility, the review can consider:

- Submitted definition
- User-provided description
- Submitted word/sign information
- User information relevant to moderation
- Submitted video/content
- Other submission metadata

The LLM produces a review that is attached to the application for the moderator.

The LLM is an **assistive review layer**. The moderator makes the final decision.

---

## Moderator Application View

For each pending application, the moderator can see:

- Submitted word/sign
- Submitted video
- Definition
- User-provided description
- Contributor information
- LLM review
- Any detected concerns/flags
- Current application status

The moderator then verifies the submission.

---

## Moderator Actions

### Approve

If the submission is valid:

```text
Moderator approves
       ↓
Video + definition + word
       ↓
Added to Dictionary
       ↓
User status = Approved
```

### Reject

If the submission does not satisfy the requirements:

```text
Moderator rejects
       ↓
Reason/action is recorded
       ↓
User status = Rejected
       ↓
User can see the reason
```

### Warning / Advice

If the user made a mistake or submitted an incorrect application, the moderator can provide:

- Warning
- Advice
- Explanation
- Reason for rejection/non-verification

### Temporary User Restriction

For inappropriate or repeated violations, the moderator can take an appropriate disciplinary action, such as temporarily blocking the user's mobile number from the platform for a specified period.

The action and reason are recorded with the moderation decision.

---

# 12. Complete User Navigation Flow

```text
                    Register
                       ↓
                     Login
                       ↓
                   Dashboard
                       │
        ┌──────────────┼─────────────────────────────┐
        ↓              ↓             ↓               ↓
    Translator     Dictionary    Awareness       Learn ISL
        │              │             │               │
        │              ↓             │               ↓
        │        Sign Detail         │          Module
        │                                            ↓
        │                                         Quiz
        │                                            ↓
        │                                      Progress/Score
        │
        └─────────────────────────────────────────────┐
                                                      ↓
                                                 Contribute
                                                      ↓
                                                   Pending
                                                      ↓
                                              LLM-Assisted Review
                                                      ↓
                                                  Moderator
                                                      ↓
                                      ┌───────────────┴───────────────┐
                                      ↓                               ↓
                                  Approved                         Rejected
                                      ↓                               ↓
                               Dictionary                    Reason/Advice
```

---

# 13. Moderator Navigation Flow

```text
                    Login
                      ↓
                  Dashboard
                      │
                      ├── Translator
                      ├── Dictionary
                      ├── Awareness
                      ├── Learn ISL
                      ├── Contribute
                      │
                      └── Moderate
                            ↓
                    Pending Applications
                            ↓
                      LLM Review
                            ↓
                    Moderator Verification
                            ↓
                 ┌──────────┴──────────┐
                 ↓                     ↓
              Approve                Reject
                 ↓                     ↓
          Add to Dictionary      Provide reason/
                                warning/advice/
                                disciplinary action
```

---

# 14. Screen Summary

| Screen | Main Purpose |
|---|---|
| Register | Create a new account |
| Login | Authenticate an existing user |
| Dashboard | Display platform/project information and statistics |
| Translator | Real-time ISL sign recognition and English voice output |
| Dictionary | Search and explore available ISL signs |
| Sign Detail | View detailed information and video for a sign |
| Awareness | Learn about ISL and related resources |
| Learn ISL | Learn signs through modules and complete assessments |
| Contribute | Submit new sign videos and information |
| Profile | View/edit user information and learning progress |
| Moderate | Review and process user contributions; moderator-only |
