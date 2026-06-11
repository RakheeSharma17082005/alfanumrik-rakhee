# Database Schema Diagram
## Alfanumrik – Chapter Learning & Assessment Module

```mermaid
erDiagram
  User ||--o{ AssessmentSession : "takes"
  Chapter ||--o{ ChapterContent : "has"
  Chapter ||--o{ MCQ : "contains"
  AssessmentSession ||--o{ StudentAnswer : "records"
  AssessmentSession ||--|| Result : "produces"
  MCQ ||--o{ StudentAnswer : "answered by"

  User {
    string id PK
    string email
    string password
    string fullName
    datetime createdAt
  }

  Chapter {
    string id PK
    string title
    string description
    string subject
    string classLevel
    int order
  }

  ChapterContent {
    string id PK
    string chapterId FK
    string topic
    string content
    json keyPoints
    string diagramUrl
    int order
  }

  MCQ {
    string id PK
    string chapterId FK
    string question
    string optionA
    string optionB
    string optionC
    string optionD
    string correctOption
    string explanation
    string difficulty
    int order
  }

  AssessmentSession {
    string id PK
    string userId FK
    string chapterId FK
    datetime startTime
    datetime endTime
    string status
  }

  StudentAnswer {
    string id PK
    string sessionId FK
    string mcqId FK
    string selectedOption
    bool isCorrect
  }

  Result {
    string id PK
    string sessionId FK
    int score
    int totalQuestions
    int correctAnswers
    int incorrectAnswers
    int skippedQuestions
    float percentage
    float accuracy
  }
```

## Table Descriptions

| Table | Purpose |
|---|---|
| User | Stores student accounts with hashed passwords |
| Chapter | Stores chapter metadata — title, subject, class |
| ChapterContent | Stores topic-wise study content per chapter |
| MCQ | Stores all questions with options and correct answers |
| AssessmentSession | Tracks each exam attempt by a student |
| StudentAnswer | Records each answer selected during an assessment |
| Result | Stores final computed score and statistics |

## Key Relationships

- One **User** can have many **AssessmentSessions**
- One **Chapter** has many **ChapterContent** records (one per topic)
- One **Chapter** has many **MCQs**
- One **AssessmentSession** belongs to one **User** and one **Chapter**
- One **AssessmentSession** has many **StudentAnswers**
- One **AssessmentSession** produces exactly one **Result**
- One **MCQ** can appear in many **StudentAnswers** (across different sessions)
