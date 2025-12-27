import React, { useState, useEffect } from 'react'
import { getItems, getCurrentStock } from '../utils/storage'
import '../App.css'

function ClosingStock() {
  const [items, setItems] = useState([])
  const [stockData, setStockData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadStockData()
  }, [])

  const loadStockData = () => {
    const allItems = getItems()
    const stockInfo = allItems.map(item => ({
      ...item,
      currentStock: getCurrentStock(item.id),
    }))
    setItems(allItems)
    setStockData(stockInfo)
  }

  const filteredStock = stockData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalItems = stockData.length
  const inStockItems = stockData.filter(item => item.currentStock > 0).length
  const outOfStockItems = stockData.filter(item => item.currentStock === 0).length
  const totalStockValue = stockData.reduce((sum, item) => 
    sum + (item.currentStock * item.purchasePrice), 0
  )

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Closing Stock</h1>
        <input
          type="text"
          className="form-input"
          placeholder="Search by name, code, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Items</div>
          <div className="stat-value">{totalItems}</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <div className="stat-label">In Stock Items</div>
          <div className="stat-value">{inStockItems}</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
          <div className="stat-label">Out of Stock Items</div>
          <div className="stat-value">{outOfStockItems}</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
          <div className="stat-label">Total Stock Value</div>
          <div className="stat-value">PKR {totalStockValue.toFixed(2)}</div>
        </div>
      </div>

      {stockData.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>No items found. Add items first to view stock.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Purchase Price</th>
                <th>Sale Price</th>
                <th>Stock Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((item) => {
                const stockValue = item.currentStock * item.purchasePrice
                const status = item.currentStock === 0 
                  ? 'Out of Stock' 
                  : item.currentStock < 10 
                  ? 'Low Stock' 
                  : 'In Stock'
                const statusColor = item.currentStock === 0 
                  ? '#ef4444' 
                  : item.currentStock < 10 
                  ? '#f59e0b' 
                  : '#10b981'
                
                return (
                  <tr key={item.id}>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td style={{ fontWeight: 'bold', color: statusColor }}>
                      {item.currentStock}
                    </td>
                    <td>PKR {item.purchasePrice.toFixed(2)}</td>
                    <td>PKR {item.salePrice.toFixed(2)}</td>
                    <td>PKR {stockValue.toFixed(2)}</td>
                    <td>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '12px', 
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        background: statusColor + '20',
                        color: statusColor
                      }}>
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ClosingStock

