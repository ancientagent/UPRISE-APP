-- First, check the current status of the test account
SELECT 
    id,
    "firstName",
    "lastName",
    email,
    status,
    "onBoardingStatus",
    "emailVerificationToken"
FROM "Users" 
WHERE email = 'testartist@example.com';

-- If the account exists but is INACTIVE, activate it
UPDATE "Users" 
SET 
    status = 'ACTIVE',
    "emailVerificationToken" = NULL,
    "onBoardingStatus" = 2
WHERE email = 'testartist@example.com' AND status = 'INACTIVE';

-- Check again after the update
SELECT 
    id,
    "firstName",
    "lastName",
    email,
    status,
    "onBoardingStatus",
    "emailVerificationToken"
FROM "Users" 
WHERE email = 'testartist@example.com'; 