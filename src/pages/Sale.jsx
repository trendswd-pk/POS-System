import React, { useState, useEffect } from 'react'
import { getItems, getSales, saveSales, getCurrentStock } from '../utils/storage'
import '../App.css'

function Sale() {
  const [items, setItems] = useState([])
  const [sales, setSales] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [saleItems, setSaleItems] = useState([])
  const [formData, setFormData] = useState({
    customerName: '',
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
    setSales(getSales())
  }

  const handleAddItem = () => {
    if (!selectedItem.itemId || !selectedItem.quantity || !selectedItem.price) {
      alert('Please fill all fields')
      return
    }

    const item = items.find(i => i.id === selectedItem.itemId)
    const currentStock = getCurrentStock(selectedItem.itemId)
    const requestedQty = parseFloat(selectedItem.quantity)

    if (requestedQty > currentStock) {
      alert(`Insufficient stock! Available: ${currentStock}`)
      return
    }

    const newSaleItem = {
      itemId: selectedItem.itemId,
      itemName: item.name,
      itemCode: item.code,
      quantity: requestedQty,
      price: parseFloat(selectedItem.price),
      total: requestedQty * parseFloat(selectedItem.price),
    }

    setSaleItems([...saleItems, newSaleItem])
    setSelectedItem({ itemId: '', quantity: '', price: '' })
  }

  const handleRemoveItem = (index) => {
    setSaleItems(saleItems.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (saleItems.length === 0) {
      alert('Please add at least one item')
      return
    }

    const totalAmount = saleItems.reduce((sum, item) => sum + item.total, 0)

    const newSale = {
      id: Date.now().toString(),
      customerName: formData.customerName,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      items: saleItems,
      totalAmount: totalAmount,
      createdAt: new Date().toISOString(),
    }

    const updatedSales = [newSale, ...sales]
    saveSales(updatedSales)
    setSales(updatedSales)
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
    })
    setSaleItems([])
    setSelectedItem({ itemId: '', quantity: '', price: '' })
  }

  const getItemPrice = (itemId) => {
    const item = items.find(i => i.id === itemId)
    return item ? item.salePrice : 0
  }

  const handleItemSelect = (itemId) => {
    const item = items.find(i => i.id === itemId)
    const currentStock = getCurrentStock(itemId)
    setSelectedItem({
      ...selectedItem,
      itemId: itemId,
      price: getItemPrice(itemId).toString(),
    })
    if (currentStock === 0) {
      alert('This item is out of stock!')
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Sale</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ New Sale
        </button>
      </div>

      {sales.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💰</div>
          <p>No sales recorded yet. Create your first sale.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice Number</th>
                <th>Customer Name</th>
                <th>Items</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{new Date(sale.date).toLocaleDateString()}</td>
                  <td>{sale.invoiceNumber}</td>
                  <td>{sale.customerName}</td>
                  <td>
                    {sale.items.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: '0.25rem' }}>
                        {item.itemName} ({item.quantity} × PKR {item.price.toFixed(2)})
                      </div>
                    ))}
                  </td>
                  <td>PKR {sale.totalAmount.toFixed(2)}</td>
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
              <h2 className="modal-title">New Sale</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Customer Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
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
                    {items.map((item) => {
                      const stock = getCurrentStock(item.id)
                      return (
                        <option key={item.id} value={item.id} disabled={stock === 0}>
                          {item.code} - {item.name} (Stock: {stock})
                        </option>
                      )
                    })}
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

                {saleItems.length > 0 && (
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
                        {saleItems.map((item, index) => (
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
                      Total: PKR {saleItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sale

