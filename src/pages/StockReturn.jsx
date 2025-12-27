import React, { useState, useEffect } from 'react'
import { getItems, getStockReturns, saveStockReturns, getPurchases } from '../utils/storage'
import '../App.css'

function StockReturn() {
  const [items, setItems] = useState([])
  const [stockReturns, setStockReturns] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [returnItems, setReturnItems] = useState([])
  const [formData, setFormData] = useState({
    supplierName: '',
    returnNumber: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [selectedItem, setSelectedItem] = useState({
    itemId: '',
    quantity: '',
    reason: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setItems(getItems())
    setStockReturns(getStockReturns())
  }

  const handleAddItem = () => {
    if (!selectedItem.itemId || !selectedItem.quantity) {
      alert('Please fill all required fields')
      return
    }

    const item = items.find(i => i.id === selectedItem.itemId)
    const newReturnItem = {
      itemId: selectedItem.itemId,
      itemName: item.name,
      itemCode: item.code,
      quantity: parseFloat(selectedItem.quantity),
      reason: selectedItem.reason,
    }

    setReturnItems([...returnItems, newReturnItem])
    setSelectedItem({ itemId: '', quantity: '', reason: '' })
  }

  const handleRemoveItem = (index) => {
    setReturnItems(returnItems.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (returnItems.length === 0) {
      alert('Please add at least one item')
      return
    }

    const newReturn = {
      id: Date.now().toString(),
      supplierName: formData.supplierName,
      returnNumber: formData.returnNumber,
      date: formData.date,
      items: returnItems,
      createdAt: new Date().toISOString(),
    }

    const updatedReturns = [newReturn, ...stockReturns]
    saveStockReturns(updatedReturns)
    setStockReturns(updatedReturns)
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      supplierName: '',
      returnNumber: '',
      date: new Date().toISOString().split('T')[0],
    })
    setReturnItems([])
    setSelectedItem({ itemId: '', quantity: '', reason: '' })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Stock Return</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ New Return
        </button>
      </div>

      {stockReturns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">↩️</div>
          <p>No stock returns recorded yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Return Number</th>
                <th>Supplier Name</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {stockReturns.map((return_) => (
                <tr key={return_.id}>
                  <td>{new Date(return_.date).toLocaleDateString()}</td>
                  <td>{return_.returnNumber}</td>
                  <td>{return_.supplierName}</td>
                  <td>
                    {return_.items.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: '0.25rem' }}>
                        {item.itemName} - Qty: {item.quantity}
                        {item.reason && <span style={{ color: '#6b7280', fontSize: '0.875rem' }}> ({item.reason})</span>}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2 className="modal-title">New Stock Return</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Supplier Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Return Number *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.returnNumber}
                  onChange={(e) => setFormData({ ...formData, returnNumber: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Add Items to Return</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <select
                    className="form-input"
                    style={{ flex: 2, minWidth: '200px' }}
                    value={selectedItem.itemId}
                    onChange={(e) => setSelectedItem({ ...selectedItem, itemId: e.target.value })}
                  >
                    <option value="">Select Item</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.code} - {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    style={{ flex: 1, minWidth: '120px' }}
                    placeholder="Quantity"
                    value={selectedItem.quantity}
                    onChange={(e) => setSelectedItem({ ...selectedItem, quantity: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ flex: 2, minWidth: '200px' }}
                    placeholder="Reason (optional)"
                    value={selectedItem.reason}
                    onChange={(e) => setSelectedItem({ ...selectedItem, reason: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddItem}
                  >
                    Add
                  </button>
                </div>

                {returnItems.length > 0 && (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Reason</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.reason || '-'}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleRemoveItem(index)}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockReturn

