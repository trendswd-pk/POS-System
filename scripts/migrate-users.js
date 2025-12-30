// Data migration utility for user records
// This script handles data transformation tasks
// 
// Usage: node scripts/migrate-users.js

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

async function migrateUserData() {
  try {
    console.log('🔍 Fetching user records from database...')
    
    // Fetch all users
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
    
    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError)
      return
    }
    
    if (!users || users.length === 0) {
      console.log('ℹ️  No user records found in database')
      return
    }
    
    console.log(`📋 Found ${users.length} user record(s)`)
    
    let processedCount = 0
    let skippedCount = 0
    
    // Process each user record
    for (const user of users) {
      const userData = user.password
      
      // Check if data transformation already applied
      if (userData && (userData.startsWith('$2a$') || userData.startsWith('$2b$'))) {
        console.log(`⏭️  Skipping ${user.username} - data already processed`)
        skippedCount++
        continue
      }
      
      if (!userData) {
        console.log(`⚠️  Skipping ${user.username} - no data found`)
        skippedCount++
        continue
      }
      
      // Apply data transformation
      console.log(`🔄 Processing data for user: ${user.username}`)
      const transformedData = await bcrypt.hash(userData, 10)
      
      // Update user record in database
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password: transformedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
      
      if (updateError) {
        console.error(`❌ Error updating ${user.username}:`, updateError)
      } else {
        console.log(`✅ Successfully processed data for: ${user.username}`)
        processedCount++
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('📊 Migration Summary:')
    console.log(`   ✅ Processed: ${processedCount} record(s)`)
    console.log(`   ⏭️  Skipped: ${skippedCount} record(s)`)
    console.log('='.repeat(50))
    console.log('\n✨ Data migration completed!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the migration
migrateUserData()

