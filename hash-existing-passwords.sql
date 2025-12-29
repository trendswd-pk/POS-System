-- =====================================================
-- Hash Existing User Passwords
-- =====================================================
-- This SQL script will hash all existing plain text passwords
-- in the users table using PostgreSQL's pgcrypto extension.
-- 
-- Instructions:
-- 1. Open your Supabase project
-- 2. Go to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Click "Run" to execute
-- 
-- IMPORTANT: After running this, all existing passwords will be hashed.
-- Users will need to use their original passwords to login (they will be hashed automatically).
-- =====================================================

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to hash passwords (using bcrypt)
-- This will hash all plain text passwords in the users table
DO $$
DECLARE
    user_record RECORD;
    hashed_pwd TEXT;
BEGIN
    -- Loop through all users
    FOR user_record IN 
        SELECT id, username, password 
        FROM users 
        WHERE password NOT LIKE '$2a$%' 
          AND password NOT LIKE '$2b$%'
    LOOP
        -- Hash the password using bcrypt (cost factor 10)
        hashed_pwd := crypt(user_record.password, gen_salt('bf', 10));
        
        -- Update the user with hashed password
        UPDATE users 
        SET password = hashed_pwd,
            updated_at = NOW()
        WHERE id = user_record.id;
        
        RAISE NOTICE 'Hashed password for user: %', user_record.username;
    END LOOP;
    
    RAISE NOTICE 'Password hashing completed!';
END $$;

-- Verify the hashing (check that all passwords are now hashed)
SELECT 
    id,
    username,
    full_name,
    CASE 
        WHEN password LIKE '$2a$%' OR password LIKE '$2b$%' THEN 'Hashed ✓'
        ELSE 'Plain Text ✗'
    END as password_status,
    updated_at
FROM users
ORDER BY updated_at DESC;

-- Expected output: All passwords should show "Hashed ✓"
-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- All existing passwords have been hashed.
-- New users will automatically have hashed passwords.
-- Existing users can still login with their original passwords.
-- =====================================================

