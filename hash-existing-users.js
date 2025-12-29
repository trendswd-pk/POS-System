// Script to hash existing user passwords in Supabase
// Run this once to hash all existing plain text passwords
// 
// Usage: node hash-existing-users.js

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local')
  console.error('Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function hashExistingPasswords() {
  try {
    console.log('🔍 Fetching users from Supabase...')
    
    // Fetch all users
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
    
    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError)
      return
    }
    
    if (!users || users.length === 0) {
      console.log('ℹ️  No users found in database')
      return
    }
    
    console.log(`📋 Found ${users.length} user(s)`)
    
    let hashedCount = 0
    let skippedCount = 0
    
    // Process each user
    for (const user of users) {
      const password = user.password
      
      // Check if password is already hashed
      if (password && (password.startsWith('$2a$') || password.startsWith('$2b$'))) {
        console.log(`⏭️  Skipping ${user.username} - password already hashed`)
        skippedCount++
        continue
      }
      
      if (!password) {
        console.log(`⚠️  Skipping ${user.username} - no password found`)
        skippedCount++
        continue
      }
      
      // Hash the password
      console.log(`🔐 Hashing password for user: ${user.username}`)
      const hashedPassword = await bcrypt.hash(password, 10)
      
      // Update user in Supabase
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
      
      if (updateError) {
        console.error(`❌ Error updating ${user.username}:`, updateError)
      } else {
        console.log(`✅ Successfully hashed password for: ${user.username}`)
        hashedCount++
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('📊 Summary:')
    console.log(`   ✅ Hashed: ${hashedCount} user(s)`)
    console.log(`   ⏭️  Skipped: ${skippedCount} user(s)`)
    console.log('='.repeat(50))
    console.log('\n✨ Password hashing completed!')
    console.log('💡 Users can still login with their original passwords.')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the script
hashExistingPasswords()

