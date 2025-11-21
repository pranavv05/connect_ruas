-- CreateTable
CREATE TABLE "mentorships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mentor_id" TEXT NOT NULL,
    "mentee_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "start_date" DATETIME,
    "end_date" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "mentorships_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "mentorships_mentee_id_fkey" FOREIGN KEY ("mentee_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "mentorship_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mentorship_id" TEXT NOT NULL,
    "scheduled_at" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "mentorship_sessions_mentorship_id_fkey" FOREIGN KEY ("mentorship_id") REFERENCES "mentorships" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "mentorships_mentor_id_idx" ON "mentorships"("mentor_id");

-- CreateIndex
CREATE INDEX "mentorships_mentee_id_idx" ON "mentorships"("mentee_id");

-- CreateIndex
CREATE INDEX "mentorships_status_idx" ON "mentorships"("status");

-- CreateIndex
CREATE UNIQUE INDEX "mentorships_mentor_id_mentee_id_key" ON "mentorships"("mentor_id", "mentee_id");

-- CreateIndex
CREATE INDEX "mentorship_sessions_mentorship_id_idx" ON "mentorship_sessions"("mentorship_id");

-- CreateIndex
CREATE INDEX "mentorship_sessions_scheduled_at_idx" ON "mentorship_sessions"("scheduled_at");

-- CreateIndex
CREATE INDEX "mentorship_sessions_status_idx" ON "mentorship_sessions"("status");
