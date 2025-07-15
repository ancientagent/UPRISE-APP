-- Activate the test artist account
UPDATE "Users" 
SET 
    status = 'ACTIVE',
    "emailVerificationToken" = NULL,
    "onBoardingStatus" = 2
WHERE email = 'testartist@example.com';

-- Verify the update
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