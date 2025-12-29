// Storage utility functions for POS System with Supabase integration
import { supabase } from './supabase'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  try {
    return supabase && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  } catch (error) {
    return false
  }
}

// ==================== ITEMS ====================
export const getItems = async () => {
  if (isSupabaseConfigured()) {
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
        unit: item.unit,
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
  
  // Fallback to localStorage
  const items = localStorage.getItem('pos_items')
  return items ? JSON.parse(items) : []
}

export const saveItems = async (items) => {
  if (isSupabaseConfigured()) {
    try {
      // Delete all existing items and insert new ones
      const { error: deleteError } = await supabase
        .from('items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
      
      if (deleteError) {
        console.error('Error deleting items:', deleteError)
      }
      
      // Convert to Supabase format and insert
      const itemsToInsert = items.map(item => ({
        code: item.code,
        name: item.name,
        unit: item.unit,
        purchase_price: parseFloat(item.purchasePrice) || 0,
        sale_price: parseFloat(item.salePrice) || 0
      }))
      
      if (itemsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('items')
          .insert(itemsToInsert)
        
        if (insertError) {
          console.error('Error inserting items:', insertError)
          throw insertError
        }
      }
      
      return
    } catch (error) {
      console.error('Error in saveItems:', error)
      throw error
    }
  }
  
  // Fallback to localStorage
  localStorage.setItem('pos_items', JSON.stringify(items))
}

// ==================== STOCK PURCHASES ====================
export const getPurchases = async () => {
  if (isSupabaseConfigured()) {
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
  
  const purchases = localStorage.getItem('pos_purchases')
  return purchases ? JSON.parse(purchases) : []
}

export const savePurchases = async (purchases) => {
  if (isSupabaseConfigured()) {
    try {
      // Delete all and insert new
      const { error: deleteError } = await supabase
        .from('stock_purchases')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      
      if (deleteError) {
        console.error('Error deleting purchases:', deleteError)
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
      
      return
    } catch (error) {
      console.error('Error in savePurchases:', error)
      throw error
    }
  }
  
  localStorage.setItem('pos_purchases', JSON.stringify(purchases))
}

// ==================== STOCK RETURNS ====================
export const getStockReturns = async () => {
  if (isSupabaseConfigured()) {
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
  
  const returns = localStorage.getItem('pos_stock_returns')
  return returns ? JSON.parse(returns) : []
}

export const saveStockReturns = async (returns) => {
  if (isSupabaseConfigured()) {
    try {
      const { error: deleteError } = await supabase
        .from('stock_returns')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      
      if (deleteError) {
        console.error('Error deleting stock returns:', deleteError)
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
      
      return
    } catch (error) {
      console.error('Error in saveStockReturns:', error)
      throw error
    }
  }
  
  localStorage.setItem('pos_stock_returns', JSON.stringify(returns))
}

// ==================== SALES ====================
export const getSales = async () => {
  if (isSupabaseConfigured()) {
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
  
  const sales = localStorage.getItem('pos_sales')
  return sales ? JSON.parse(sales) : []
}

export const saveSales = async (sales) => {
  if (isSupabaseConfigured()) {
    try {
      const { error: deleteError } = await supabase
        .from('sales')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      
      if (deleteError) {
        console.error('Error deleting sales:', deleteError)
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
      
      return
    } catch (error) {
      console.error('Error in saveSales:', error)
      throw error
    }
  }
  
  localStorage.setItem('pos_sales', JSON.stringify(sales))
}

// ==================== SALE RETURNS ====================
export const getSaleReturns = async () => {
  if (isSupabaseConfigured()) {
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
  
  const returns = localStorage.getItem('pos_sale_returns')
  return returns ? JSON.parse(returns) : []
}

export const saveSaleReturns = async (returns) => {
  if (isSupabaseConfigured()) {
    try {
      const { error: deleteError } = await supabase
        .from('sale_returns')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      
      if (deleteError) {
        console.error('Error deleting sale returns:', deleteError)
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
      
      return
    } catch (error) {
      console.error('Error in saveSaleReturns:', error)
      throw error
    }
  }
  
  localStorage.setItem('pos_sale_returns', JSON.stringify(returns))
}

// ==================== USERS ====================
export const getUsers = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching users:', error)
        return []
      }
      
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
  
  const users = localStorage.getItem('pos_users')
  return users ? JSON.parse(users) : []
}

export const saveUsers = async (users) => {
  if (isSupabaseConfigured()) {
    try {
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      
      if (deleteError) {
        console.error('Error deleting users:', deleteError)
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
      
      return
    } catch (error) {
      console.error('Error in saveUsers:', error)
      throw error
    }
  }
  
  localStorage.setItem('pos_users', JSON.stringify(users))
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
export const getCurrentStock = async (itemId) => {
  const purchases = await getPurchases()
  const stockReturns = await getStockReturns()
  const sales = await getSales()
  const saleReturns = await getSaleReturns()

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
