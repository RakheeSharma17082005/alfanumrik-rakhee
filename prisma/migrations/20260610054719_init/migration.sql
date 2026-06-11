-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssessmentSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" DATETIME,
    "duration" INTEGER,
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER,
    "score" REAL,
    "percentage" REAL,
    "accuracy" REAL,
    CONSTRAINT "AssessmentSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssessmentSession_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AssessmentSession" ("accuracy", "chapterId", "correctAnswers", "duration", "id", "percentage", "score", "startedAt", "submittedAt", "totalQuestions", "userId") SELECT "accuracy", "chapterId", "correctAnswers", "duration", "id", "percentage", "score", "startedAt", "submittedAt", "totalQuestions", "userId" FROM "AssessmentSession";
DROP TABLE "AssessmentSession";
ALTER TABLE "new_AssessmentSession" RENAME TO "AssessmentSession";
CREATE INDEX "AssessmentSession_userId_idx" ON "AssessmentSession"("userId");
CREATE INDEX "AssessmentSession_chapterId_idx" ON "AssessmentSession"("chapterId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
