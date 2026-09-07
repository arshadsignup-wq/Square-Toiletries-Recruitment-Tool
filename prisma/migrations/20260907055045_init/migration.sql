-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "applicationNo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hrNotes" TEXT,
    "positionAppliedFor" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "homeTown" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "religionManual" TEXT,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "spouseName" TEXT,
    "spouseOccupation" TEXT,
    "spouseMobile" TEXT,
    "maleChildrenCount" INTEGER,
    "femaleChildrenCount" INTEGER,
    "fatherName" TEXT NOT NULL,
    "fatherOccupation" TEXT,
    "fatherTelNo" TEXT,
    "motherName" TEXT NOT NULL,
    "motherOccupation" TEXT,
    "motherTelNo" TEXT,
    "presentVillage" TEXT NOT NULL,
    "presentPO" TEXT NOT NULL,
    "presentPS" TEXT NOT NULL,
    "presentDistrict" TEXT NOT NULL,
    "sameAsPresent" BOOLEAN NOT NULL DEFAULT false,
    "permanentVillage" TEXT NOT NULL,
    "permanentPO" TEXT NOT NULL,
    "permanentPS" TEXT NOT NULL,
    "permanentDistrict" TEXT NOT NULL,
    "accommodationType" TEXT,
    "livingWith" TEXT,
    "nidNumber" TEXT,
    "drivingLicenseNumber" TEXT,
    "passportNo" TEXT,
    "passportIssuePlace" TEXT,
    "passportIssueDate" TIMESTAMP(3),
    "passportExpireDate" TIMESTAMP(3),
    "hobby" TEXT,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactTitle" TEXT NOT NULL,
    "emergencyContactTelNo" TEXT NOT NULL,
    "sscType" TEXT NOT NULL,
    "sscTypeManual" TEXT,
    "sscGroup" TEXT NOT NULL,
    "sscGroupManual" TEXT,
    "sscInstitution" TEXT NOT NULL,
    "sscBoard" TEXT NOT NULL,
    "sscBoardManual" TEXT,
    "sscResult" TEXT NOT NULL,
    "sscYear" TEXT NOT NULL,
    "hscType" TEXT,
    "hscTypeManual" TEXT,
    "hscGroup" TEXT,
    "hscGroupManual" TEXT,
    "hscInstitution" TEXT,
    "hscBoard" TEXT,
    "hscBoardManual" TEXT,
    "hscResult" TEXT,
    "hscYear" TEXT,
    "experienceStatus" TEXT NOT NULL,
    "totalDuration" TEXT,
    "currentSalary" INTEGER,
    "expectedSalary" INTEGER NOT NULL,
    "benefits" TEXT,
    "bonusCount" TEXT,
    "otherBenefits" TEXT,
    "noticePeriod" TEXT NOT NULL,
    "medicalHistory" TEXT,
    "hasDisability" BOOLEAN NOT NULL DEFAULT false,
    "disabilityDetails" TEXT,
    "relationInSquare" TEXT,
    "source" TEXT NOT NULL,
    "sourceManual" TEXT,
    "photoData" TEXT,
    "declaration" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependent" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "relationship" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sibling" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "occupation" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Sibling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HigherEducation" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "degreeType" TEXT,
    "degreeTypeManual" TEXT,
    "major" TEXT,
    "institution" TEXT,
    "isAffiliated" BOOLEAN NOT NULL DEFAULT false,
    "affiliatedUniversity" TEXT,
    "result" TEXT,
    "passingYear" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HigherEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "orgName" TEXT,
    "designation" TEXT,
    "fromDate" TEXT,
    "toDate" TEXT,
    "currentlyWorking" BOOLEAN NOT NULL DEFAULT false,
    "duration" TEXT,
    "superiorName" TEXT,
    "superiorTitle" TEXT,
    "superiorTelNo" TEXT,
    "salaryStart" INTEGER,
    "salaryEnd" INTEGER,
    "reasonForLeaving" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "designation" TEXT,
    "fromDate" TEXT,
    "toDate" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquareRelation" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "department" TEXT,
    "company" TEXT,
    "relationship" TEXT,
    "mobile" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SquareRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "referenceNo" TEXT NOT NULL,
    "candidateName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "department" TEXT,
    "age" INTEGER NOT NULL,
    "nidNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Position_title_key" ON "Position"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Application_applicationNo_key" ON "Application"("applicationNo");

-- CreateIndex
CREATE INDEX "Application_positionAppliedFor_idx" ON "Application"("positionAppliedFor");

-- CreateIndex
CREATE INDEX "Application_submittedAt_idx" ON "Application"("submittedAt");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Dependent_applicationId_idx" ON "Dependent"("applicationId");

-- CreateIndex
CREATE INDEX "Sibling_applicationId_idx" ON "Sibling"("applicationId");

-- CreateIndex
CREATE INDEX "HigherEducation_applicationId_idx" ON "HigherEducation"("applicationId");

-- CreateIndex
CREATE INDEX "Experience_applicationId_idx" ON "Experience"("applicationId");

-- CreateIndex
CREATE INDEX "Promotion_experienceId_idx" ON "Promotion"("experienceId");

-- CreateIndex
CREATE INDEX "SquareRelation_applicationId_idx" ON "SquareRelation"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_referenceNo_key" ON "Proposal"("referenceNo");

-- CreateIndex
CREATE INDEX "Proposal_applicationId_idx" ON "Proposal"("applicationId");

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sibling" ADD CONSTRAINT "Sibling_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HigherEducation" ADD CONSTRAINT "HigherEducation_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquareRelation" ADD CONSTRAINT "SquareRelation_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
