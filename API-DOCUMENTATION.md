# API Documentation
## Alfanumrik – Chapter Learning & Assessment Module

Base URL: `https://alfanumrik-rakhee.vercel.app/api`

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication

### POST /api/auth/register
Register a new student account.

**Request Body:**
```json
{
  "fullName": "Rakhi Sharma",
  "email": "rakhi@example.com",
  "password": "Password@123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "clx123abc",
    "email": "rakhi@example.com",
    "fullName": "Rakhi Sharma",
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

**Error Responses:**
- `400` — Validation error (invalid email, weak password)
- `409` — User already exists
- `500` — Server error

---

### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "rakhi@example.com",
  "password": "Password@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "clx123abc",
    "email": "rakhi@example.com",
    "fullName": "Rakhi Sharma",
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

**Error Responses:**
- `400` — Validation error
- `401` — Invalid email or password
- `500` — Server error

---

## Chapters

### GET /api/chapters
Get all available chapters.

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx456def",
      "title": "Life Processes",
      "description": "Understanding fundamental life processes...",
      "subject": "Science",
      "classLevel": "10",
      "order": 1,
      "_count": {
        "mcqs": 20
      }
    }
  ]
}
```

---

### GET /api/chapters/[id]
Get a single chapter with full content and MCQs.

**Headers:** `Authorization: Bearer <token>`

**URL Params:** `id` — Chapter ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx456def",
    "title": "Life Processes",
    "subject": "Science",
    "classLevel": "10",
    "content": [
      {
        "id": "clx789ghi",
        "topic": "Photosynthesis",
        "content": "Photosynthesis is...",
        "keyPoints": ["Point 1", "Point 2"],
        "diagramUrl": "https://...",
        "order": 1
      }
    ],
    "mcqs": [
      {
        "id": "clxabc123",
        "question": "What is photosynthesis?",
        "optionA": "...",
        "optionB": "...",
        "optionC": "...",
        "optionD": "...",
        "difficulty": "easy",
        "order": 1
      }
    ]
  }
}
```

**Note:** `correctOption` and `explanation` are NOT returned here — only returned after submission.

**Error Responses:**
- `404` — Chapter not found
- `500` — Server error

---

## Assessments

### POST /api/assessments/start
Start a new assessment session for a chapter.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "chapterId": "clx456def"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "sessionId": "clxsession123",
    "chapterId": "clx456def",
    "startTime": "2026-06-11T07:45:00.000Z",
    "status": "IN_PROGRESS"
  }
}
```

**Error Responses:**
- `400` — Missing chapterId
- `404` — Chapter not found
- `500` — Server error

---

### POST /api/assessments/save-answer
Auto-save a student's answer during the assessment.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "sessionId": "clxsession123",
  "mcqId": "clxabc123",
  "selectedOption": "B"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Answer saved"
}
```

**Error Responses:**
- `400` — Missing required fields
- `403` — Session does not belong to user
- `500` — Server error

---

### POST /api/assessments/submit
Submit the assessment and calculate results.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "sessionId": "clxsession123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "resultId": "clxresult456",
    "score": 16,
    "totalQuestions": 20,
    "correctAnswers": 16,
    "incorrectAnswers": 3,
    "skippedQuestions": 1,
    "percentage": 80.0,
    "accuracy": 84.2,
    "timeTaken": 1245
  }
}
```

**Error Responses:**
- `400` — Session already submitted
- `403` — Session does not belong to user
- `404` — Session not found
- `500` — Server error

---

### GET /api/assessments/[id]
Get full details of a completed assessment including answers and explanations.

**Headers:** `Authorization: Bearer <token>`

**URL Params:** `id` — Session ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "clxsession123",
      "status": "COMPLETED",
      "startTime": "2026-06-11T07:45:00.000Z",
      "endTime": "2026-06-11T08:10:00.000Z"
    },
    "result": {
      "score": 16,
      "percentage": 80.0,
      "accuracy": 84.2,
      "correctAnswers": 16,
      "incorrectAnswers": 3,
      "skippedQuestions": 1
    },
    "answers": [
      {
        "mcqId": "clxabc123",
        "question": "What is photosynthesis?",
        "selectedOption": "B",
        "correctOption": "A",
        "isCorrect": false,
        "explanation": "Photosynthesis is..."
      }
    ]
  }
}
```

---

## Dashboard

### GET /api/dashboard
Get the logged-in student's full performance history.

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalAttempts": 5,
    "averageScore": 75.4,
    "averageAccuracy": 78.2,
    "attempts": [
      {
        "sessionId": "clxsession123",
        "chapterTitle": "Life Processes",
        "subject": "Science",
        "score": 16,
        "totalQuestions": 20,
        "percentage": 80.0,
        "accuracy": 84.2,
        "correctAnswers": 16,
        "incorrectAnswers": 3,
        "skippedQuestions": 1,
        "completedAt": "2026-06-11T08:10:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**
- `401` — Unauthorized (missing or invalid token)
- `500` — Server error

---

## Error Format

All errors follow this format:
```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

## Authentication Notes

- Tokens expire after **7 days**
- Token must be stored client-side (localStorage)
- Send token as: `Authorization: Bearer eyJhbG...`
- A `401` response means the token is missing, expired, or invalid
