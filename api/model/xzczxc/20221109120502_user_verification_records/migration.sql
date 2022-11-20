-- CreateTable
CREATE TABLE "UserVerificationRecords" (
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "UserVerificationRecords_pkey" PRIMARY KEY ("id")
);
