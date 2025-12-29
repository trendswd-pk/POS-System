// Storage utility functions for POS System with Supabase integration
import { supabase } from './supabase'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  try {
    const hasUrl = import.meta.env.VITE_SUPABASE_URL
    const hasKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const hasClient = supabase !== null && supabase !== undefined
    
    if (!hasUrl || !hasKey) {
      console.log('Supabase not configured: Missing environment variables')
      return false
    }
    
    if (!hasClient) {
      console.log('Supabase not configured: Client not initialized')
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error checking Supabase configuration:', error)
    return false
  }
}

// ==================== ITEMS ====================
export const getItems = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Please configure Supabase to use the application.')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching items:', error)
      return []
    }
    
    // Convert to local format
    return data.map(item => ({
      id: item.id,
      code: item.code,
      name: item.name,
      category: item.category || '',
      purchasePrice: parseFloat(item.purchase_price) || 0,
      salePrice: parseFloat(item.sale_price) || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))
  } catch (error) {
    console.error('Error in getItems:', error)
    return []
  }
}

export const saveItems = async (items) => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Cannot save items.')
    throw new Error('Supabase not configured. Please configure Supabase to use the application.')
  }
  
  try {
    console.log('Saving items to Supabase...', items.length, 'items')
    
    // Delete all existing items and insert new ones
    const { error: deleteError } = await supabase
      .from('items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (deleteError) {
      console.error('Error deleting items from Supabase:', deleteError)
      throw deleteError
    }
    
    console.log('Deleted existing items from Supabase')
    
    // Convert to Supabase format and insert
    const itemsToInsert = items.map(item => ({
      code: item.code,
      name: item.name,
      category: item.category || '', // Category field
      purchase_price: parseFloat(item.purchasePrice) || 0,
      sale_price: parseFloat(item.salePrice) || 0
    }))
    
    console.log('Items to insert:', itemsToInsert)
    
    if (itemsToInsert.length > 0) {
      const { data, error: insertError } = await supabase
        .from('items')
        .insert(itemsToInsert)
        .select()
      
      if (insertError) {
        console.error('Error inserting items to Supabase:', insertError)
        console.error('Error details:', JSON.stringify(insertError, null, 2))
        throw insertError
      }
      
      console.log('✅ Items saved to Supabase successfully!', data.length, 'items inserted')
    } else {
      console.log('No items to insert')
    }
  } catch (error) {
    console.error('Error in saveItems:', error)
    throw error
  }
}

// ==================== STOCK PURCHASES ====================
export const getPurchases = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Please configure Supabase to use the application.')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('stock_purchases')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching purchases:', error)
      return []
    }
    
    return data.map(purchase => ({
      id: purchase.id,
      invoiceNumber: purchase.invoice_number,
      supplierName: purchase.supplier_name,
      date: purchase.date,
      narration: purchase.narration || '',
      items: purchase.items || [],
      totalAmount: parseFloat(purchase.total_amount) || 0,
      createdAt: purchase.created_at,
      updatedAt: purchase.updated_at
    }))
  } catch (error) {
    console.error('Error in getPurchases:', error)
    return []
  }
}

export const savePurchases = async (purchases) => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Cannot save purchases.')
    throw new Error('Supabase not configured. Please configure Supabase to use the application.')
  }
  
  try {
    // Delete all and insert new
    const { error: deleteError } = await supabase
      .from('stock_purchases')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (deleteError) {
      console.error('Error deleting purchases:', deleteError)
      throw deleteError
    }
    
    const purchasesToInsert = purchases.map(purchase => ({
      invoice_number: purchase.invoiceNumber,
      supplier_name: purchase.supplierName,
      date: purchase.date,
      narration: purchase.narration || '',
      items: purchase.items || [],
      total_amount: parseFloat(purchase.totalAmount) || 0
    }))
    
    if (purchasesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('stock_purchases')
        .insert(purchasesToInsert)
      
      if (insertError) {
        console.error('Error inserting purchases:', insertError)
        throw insertError
      }
    }
  } catch (error) {
    console.error('Error in savePurchases:', error)
    throw error
  }
}

// ==================== STOCK RETURNS ====================
export const getStockReturns = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Please configure Supabase to use the application.')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('stock_returns')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching stock returns:', error)
      return []
    }
    
    return data.map(return_ => ({
      id: return_.id,
      returnNumber: return_.return_number,
      supplierName: return_.supplier_name,
      date: return_.date,
      narration: return_.narration || '',
      items: return_.items || [],
      totalAmount: parseFloat(return_.total_amount) || 0,
      createdAt: return_.created_at,
      updatedAt: return_.updated_at
    }))
  } catch (error) {
    console.error('Error in getStockReturns:', error)
    return []
  }
}

export const saveStockReturns = async (returns) => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Cannot save stock returns.')
    throw new Error('Supabase not configured. Please configure Supabase to use the application.')
  }
  
  try {
    const { error: deleteError } = await supabase
      .from('stock_returns')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (deleteError) {
      console.error('Error deleting stock returns:', deleteError)
      throw deleteError
    }
    
    const returnsToInsert = returns.map(return_ => ({
      return_number: return_.returnNumber,
      supplier_name: return_.supplierName,
      date: return_.date,
      narration: return_.narration || '',
      items: return_.items || [],
      total_amount: parseFloat(return_.totalAmount) || 0
    }))
    
    if (returnsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('stock_returns')
        .insert(returnsToInsert)
      
      if (insertError) {
        console.error('Error inserting stock returns:', insertError)
        throw insertError
      }
    }
  } catch (error) {
    console.error('Error in saveStockReturns:', error)
    throw error
  }
}

// ==================== SALES ====================
export const getSales = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Please configure Supabase to use the application.')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching sales:', error)
      return []
    }
    
    return data.map(sale => ({
      id: sale.id,
      invoiceNumber: sale.invoice_number,
      customerName: sale.customer_name,
      date: sale.date,
      narration: sale.narration || '',
      items: sale.items || [],
      totalAmount: parseFloat(sale.total_amount) || 0,
      createdAt: sale.created_at,
      updatedAt: sale.updated_at
    }))
  } catch (error) {
    console.error('Error in getSales:', error)
    return []
  }
}

export const saveSales = async (sales) => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Cannot save sales.')
    throw new Error('Supabase not configured. Please configure Supabase to use the application.')
  }
  
  try {
    const { error: deleteError } = await supabase
      .from('sales')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (deleteError) {
      console.error('Error deleting sales:', deleteError)
      throw deleteError
    }
    
    const salesToInsert = sales.map(sale => ({
      invoice_number: sale.invoiceNumber,
      customer_name: sale.customerName,
      date: sale.date,
      narration: sale.narration || '',
      items: sale.items || [],
      total_amount: parseFloat(sale.totalAmount) || 0
    }))
    
    if (salesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('sales')
        .insert(salesToInsert)
      
      if (insertError) {
        console.error('Error inserting sales:', insertError)
        throw insertError
      }
    }
  } catch (error) {
    console.error('Error in saveSales:', error)
    throw error
  }
}

// ==================== SALE RETURNS ====================
export const getSaleReturns = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Please configure Supabase to use the application.')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('sale_returns')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching sale returns:', error)
      return []
    }
    
    return data.map(return_ => ({
      id: return_.id,
      returnNumber: return_.return_number,
      customerName: return_.customer_name,
      date: return_.date,
      narration: return_.narration || '',
      items: return_.items || [],
      totalAmount: parseFloat(return_.total_amount) || 0,
      createdAt: return_.created_at,
      updatedAt: return_.updated_at
    }))
  } catch (error) {
    console.error('Error in getSaleReturns:', error)
    return []
  }
}

export const saveSaleReturns = async (returns) => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Cannot save sale returns.')
    throw new Error('Supabase not configured. Please configure Supabase to use the application.')
  }
  
  try {
    const { error: deleteError } = await supabase
      .from('sale_returns')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (deleteError) {
      console.error('Error deleting sale returns:', deleteError)
      throw deleteError
    }
    
    const returnsToInsert = returns.map(return_ => ({
      return_number: return_.returnNumber,
      customer_name: return_.customerName,
      date: return_.date,
      narration: return_.narration || '',
      items: return_.items || [],
      total_amount: parseFloat(return_.totalAmount) || 0
    }))
    
    if (returnsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('sale_returns')
        .insert(returnsToInsert)
      
      if (insertError) {
        console.error('Error inserting sale returns:', insertError)
        throw insertError
      }
    }
  } catch (error) {
    console.error('Error in saveSaleReturns:', error)
    throw error
  }
}

// ==================== USERS ====================
export const getUsers = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Please configure Supabase to use the application.')
    return []
  }
  
  try {
    console.log('Fetching users from Supabase...')
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching users from Supabase:', error)
      return []
    }
    
    console.log('Users fetched from Supabase:', data.length)
    return data.map(user => ({
      id: user.id,
      username: user.username,
      password: user.password,
      fullName: user.full_name,
      permissions: user.permissions || {},
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }))
  } catch (error) {
    console.error('Error in getUsers:', error)
    return []
  }
}

export const saveUsers = async (users) => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured. Cannot save users.')
    throw new Error('Supabase not configured. Please configure Supabase to use the application.')
  }
  
  try {
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (deleteError) {
      console.error('Error deleting users:', deleteError)
      throw deleteError
    }
    
    const usersToInsert = users.map(user => ({
      username: user.username,
      password: user.password,
      full_name: user.fullName,
      permissions: user.permissions || {}
    }))
    
    if (usersToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('users')
        .insert(usersToInsert)
      
      if (insertError) {
        console.error('Error inserting users:', insertError)
        throw insertError
      }
    }
  } catch (error) {
    console.error('Error in saveUsers:', error)
    throw error
  }
}

// ==================== CURRENT USER (Still uses localStorage for session) ====================
export const getCurrentUser = () => {
  const user = localStorage.getItem('pos_current_user')
  return user ? JSON.parse(user) : null
}

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('pos_current_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('pos_current_user')
  }
}

// ==================== STOCK CALCULATION ====================
// Cache for stock calculations to avoid repeated database calls
let stockCache = {
  data: null,
  timestamp: 0,
  cacheDuration: 5000 // 5 seconds cache
}

const getStockData = async () => {
  const now = Date.now()
  // Return cached data if still valid
  if (stockCache.data && (now - stockCache.timestamp) < stockCache.cacheDuration) {
    return stockCache.data
  }
  
  // Fetch all data in parallel
  const [purchases, stockReturns, sales, saleReturns] = await Promise.all([
    getPurchases(),
    getStockReturns(),
    getSales(),
    getSaleReturns()
  ])
  
  // Cache the data
  stockCache = {
    data: { purchases, stockReturns, sales, saleReturns },
    timestamp: now
  }
  
  return stockCache.data
}

export const getCurrentStock = async (itemId) => {
  const { purchases, stockReturns, sales, saleReturns } = await getStockData()

  let stock = 0

  // Add purchases
  purchases.forEach(purchase => {
    purchase.items.forEach(item => {
      if (item.itemId === itemId) {
        stock += item.quantity
      }
    })
  })

  // Subtract stock returns
  stockReturns.forEach(return_ => {
    return_.items.forEach(item => {
      if (item.itemId === itemId) {
        stock -= item.quantity
      }
    })
  })

  // Subtract sales
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (item.itemId === itemId) {
        stock -= item.quantity
      }
    })
  })

  // Add sale returns
  saleReturns.forEach(return_ => {
    return_.items.forEach(item => {
      if (item.itemId === itemId) {
        stock += item.quantity
      }
    })
  })

  return stock
}

// Batch function to get stocks for multiple items at once
export const getCurrentStocksBatch = async (itemIds) => {
  const { purchases, stockReturns, sales, saleReturns } = await getStockData()
  
  const stockMap = {}
  
  // Initialize all items to 0
  itemIds.forEach(id => {
    stockMap[id] = 0
  })

  // Add purchases
  purchases.forEach(purchase => {
    purchase.items.forEach(item => {
      if (stockMap.hasOwnProperty(item.itemId)) {
        stockMap[item.itemId] += item.quantity
      }
    })
  })

  // Subtract stock returns
  stockReturns.forEach(return_ => {
    return_.items.forEach(item => {
      if (stockMap.hasOwnProperty(item.itemId)) {
        stockMap[item.itemId] -= item.quantity
      }
    })
  })

  // Subtract sales
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (stockMap.hasOwnProperty(item.itemId)) {
        stockMap[item.itemId] -= item.quantity
      }
    })
  })

  // Add sale returns
  saleReturns.forEach(return_ => {
    return_.items.forEach(item => {
      if (stockMap.hasOwnProperty(item.itemId)) {
        stockMap[item.itemId] += item.quantity
      }
    })
  })

  return stockMap
}

// Clear stock cache (call this after any stock-affecting operation)
export const clearStockCache = () => {
  stockCache = {
    data: null,
    timestamp: 0
  }
}

// Default permissions structure
export const defaultPermissions = {
  items: false,
  stockPurchase: false,
  stockReturn: false,
  sale: false,
  saleReturn: false,
  closingStock: false,
  users: false,
}
