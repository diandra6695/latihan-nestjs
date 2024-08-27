-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
