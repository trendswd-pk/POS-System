import React, { useState, useEffect } from 'react'
import { getItems, getPurchases, savePurchases } from '../utils/storage'
import '../App.css'

function StockPurchase() {
  const [items, setItems] = useState([])
  const [purchases, setPurchases] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [purchaseItems, setPurchaseItems] = useState([])
  const [formData, setFormData] = useState({
    supplierName: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [selectedItem, setSelectedItem] = useState({
    itemId: '',
    quantity: '',
    price: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setItems(getItems())
    setPurchases(getPurchases())
  }

  const handleAddItem = () => {
    if (!selectedItem.itemId || !selectedItem.quantity || !selectedItem.price) {
      alert('Please fill all fields')
      return
    }

    const item = items.find(i => i.id === selectedItem.itemId)
    const newPurchaseItem = {
      itemId: selectedItem.itemId,
      itemName: item.name,
      itemCode: item.code,
      quantity: parseFloat(selectedItem.quantity),
      price: parseFloat(selectedItem.price),
      total: parseFloat(selectedItem.quantity) * parseFloat(selectedItem.price),
    }

    setPurchaseItems([...purchaseItems, newPurchaseItem])
    setSelectedItem({ itemId: '', quantity: '', price: '' })
  }

  const handleRemoveItem = (index) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (purchaseItems.length === 0) {
      alert('Please add at least one item')
      return
    }

    const totalAmount = purchaseItems.reduce((sum, item) => sum + item.total, 0)

    const newPurchase = {
      id: Date.now().toString(),
      supplierName: formData.supplierName,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      items: purchaseItems,
      totalAmount: totalAmount,
      createdAt: new Date().toISOString(),
    }

    const updatedPurchases = [newPurchase, ...purchases]
    savePurchases(updatedPurchases)
    setPurchases(updatedPurchases)
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      supplierName: '',
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
    })
    setPurchaseItems([])
    setSelectedItem({ itemId: '', quantity: '', price: '' })
  }

  const getItemPrice = (itemId) => {
    const item = items.find(i => i.id === itemId)
    return item ? item.purchasePrice : 0
  }

  const handleItemSelect = (itemId) => {
    setSelectedItem({
      ...selectedItem,
      itemId: itemId,
      price: getItemPrice(itemId).toString(),
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Stock Purchase</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ New Purchase
        </button>
      </div>

      {purchases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <p>No purchases recorded yet. Create your first purchase.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice Number</th>
                <th>Supplier Name</th>
                <th>Items</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{new Date(purchase.date).toLocaleDateString()}</td>
                  <td>{purchase.invoiceNumber}</td>
                  <td>{purchase.supplierName}</td>
                  <td>
                    {purchase.items.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: '0.25rem' }}>
                        {item.itemName} ({item.quantity} × PKR {item.price.toFixed(2)})
                      </div>
                    ))}
                  </td>
                  <td>PKR {purchase.totalAmount.toFixed(2)}</td>
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
              <h2 className="modal-title">New Stock Purchase</h2>
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
                <label className="form-label">Invoice Number *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
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
                <h3 style={{ marginBottom: '1rem' }}>Add Items</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <select
                    className="form-input"
                    style={{ flex: 2 }}
                    value={selectedItem.itemId}
                    onChange={(e) => handleItemSelect(e.target.value)}
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
                    style={{ flex: 1 }}
                    placeholder="Quantity"
                    value={selectedItem.quantity}
                    onChange={(e) => setSelectedItem({ ...selectedItem, quantity: e.target.value })}
                  />
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    style={{ flex: 1 }}
                    placeholder="Price"
                    value={selectedItem.price}
                    onChange={(e) => setSelectedItem({ ...selectedItem, price: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddItem}
                  >
                    Add
                  </button>
                </div>

                {purchaseItems.length > 0 && (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>PKR {item.price.toFixed(2)}</td>
                            <td>PKR {item.total.toFixed(2)}</td>
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
                    <div style={{ marginTop: '1rem', textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      Total: PKR {purchaseItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockPurchase

