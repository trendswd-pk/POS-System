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
-- DISABLE ROW LEVEL SECURITY (For Development)
-- =====================================================
-- Note: For production, you may want to enable RLS
-- and create appropriate policies

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE items DISABLE ROW LEVEL SECURITY;
ALTER TABLE stock_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE stock_returns DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE sale_returns DISABLE ROW LEVEL SECURITY;

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

