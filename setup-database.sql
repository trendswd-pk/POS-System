-- =====================================================
-- POS System - Complete Database Setup
-- =====================================================
-- This file contains all SQL commands needed to set up
-- the POS System database in Supabase.
-- 
-- Instructions:
-- 1. Open your Supabase project
-- 2. Go to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Click "Run" to execute
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Items Table
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT '',
  purchase_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sale_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock Purchases Table
CREATE TABLE IF NOT EXISTS stock_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  supplier_name TEXT NOT NULL,
  date DATE NOT NULL,
  narration TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock Returns Table
CREATE TABLE IF NOT EXISTS stock_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_number TEXT UNIQUE NOT NULL,
  supplier_name TEXT NOT NULL,
  date DATE NOT NULL,
  narration TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Table
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  date DATE NOT NULL,
  narration TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sale Returns Table
CREATE TABLE IF NOT EXISTS sale_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  date DATE NOT NULL,
  narration TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE INDEXES (For Better Performance)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_items_code ON items(code);
CREATE INDEX IF NOT EXISTS idx_stock_purchases_invoice ON stock_purchases(invoice_number);
CREATE INDEX IF NOT EXISTS idx_stock_returns_return_number ON stock_returns(return_number);
CREATE INDEX IF NOT EXISTS idx_sales_invoice ON sales(invoice_number);
CREATE INDEX IF NOT EXISTS idx_sale_returns_return_number ON sale_returns(return_number);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- =====================================================
-- ENSURE CATEGORY COLUMN EXISTS (For Existing Tables)
-- =====================================================

ALTER TABLE items 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '';

UPDATE items 
SET category = '' 
WHERE category IS NULL;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on all tables for security
-- Policies are created below to allow application access

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_returns ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================
-- Policies to allow full access (SELECT, INSERT, UPDATE, DELETE)
-- for all tables using the anon key
-- Note: These policies allow public access since the app uses
-- custom authentication with the anon key

DO $$
BEGIN
  -- Users Table Policy
  BEGIN
    CREATE POLICY allow_all_users ON users
      FOR ALL
      USING (true)
      WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'Policy allow_all_users already exists, skipping...';
  END;

  -- Items Table Policy
  BEGIN
    CREATE POLICY allow_all_items ON items
      FOR ALL
      USING (true)
      WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'Policy allow_all_items already exists, skipping...';
  END;

  -- Stock Purchases Table Policy
  BEGIN
    CREATE POLICY allow_all_stock_purchases ON stock_purchases
      FOR ALL
      USING (true)
      WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'Policy allow_all_stock_purchases already exists, skipping...';
  END;

  -- Stock Returns Table Policy
  BEGIN
    CREATE POLICY allow_all_stock_returns ON stock_returns
      FOR ALL
      USING (true)
      WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'Policy allow_all_stock_returns already exists, skipping...';
  END;

  -- Sales Table Policy
  BEGIN
    CREATE POLICY allow_all_sales ON sales
      FOR ALL
      USING (true)
      WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'Policy allow_all_sales already exists, skipping...';
  END;

  -- Sale Returns Table Policy
  BEGIN
    CREATE POLICY allow_all_sale_returns ON sale_returns
      FOR ALL
      USING (true)
      WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'Policy allow_all_sale_returns already exists, skipping...';
  END;
END $$;

-- =====================================================
-- CREATE DEFAULT ADMIN USER
-- =====================================================
-- Default credentials:
-- Username: admin
-- Password: admin123
-- 
-- IMPORTANT: Change the password after first login!

INSERT INTO users (username, password, full_name, permissions, created_at, updated_at)
VALUES (
  'admin',                    -- Username
  'admin123',                 -- Password (CHANGE THIS!)
  'Administrator',            -- Full Name
  '{
    "items": true,
    "stockPurchase": true,
    "stockReturn": true,
    "sale": true,
    "saleReturn": true,
    "closingStock": true,
    "users": true
  }'::jsonb,                  -- All permissions enabled
  NOW(),
  NOW()
)
ON CONFLICT (username) DO NOTHING;  -- Prevents error if admin already exists

-- =====================================================
-- HASH EXISTING USER PASSWORDS
-- =====================================================
-- This will hash all plain text passwords in the users table
-- using bcrypt. Already hashed passwords will be skipped.

DO $$
DECLARE
    user_record RECORD;
    hashed_pwd TEXT;
BEGIN
    -- Loop through all users with plain text passwords
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

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all tables were created
SELECT 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'items', 'stock_purchases', 'stock_returns', 'sales', 'sale_returns')
ORDER BY tablename;

-- Check admin user was created
SELECT id, username, full_name, permissions, created_at 
FROM users 
WHERE username = 'admin';

-- Verify all passwords are hashed
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

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next Steps:
-- 1. Update .env.local file with your Supabase credentials:
--    VITE_SUPABASE_URL=your_supabase_url
--    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
-- 
-- 2. Run: npm install
-- 3. Run: npm run dev
-- 4. Login with: admin / admin123
-- 5. Change admin password immediately!
-- =====================================================

