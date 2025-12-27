import React, { useState, useEffect } from 'react'
import { getItems, saveItems } from '../utils/storage'
import '../App.css'

function Items() {
  const [items, setItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    unit: '',
    purchasePrice: '',
    salePrice: '',
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = () => {
    const loadedItems = getItems()
    setItems(loadedItems)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: formData.name,
      code: formData.code,
      category: formData.category,
      unit: formData.unit,
      purchasePrice: parseFloat(formData.purchasePrice),
      salePrice: parseFloat(formData.salePrice),
    }

    let updatedItems
    if (editingItem) {
      updatedItems = items.map(item => 
        item.id === editingItem.id ? newItem : item
      )
    } else {
      updatedItems = [...items, newItem]
    }

    saveItems(updatedItems)
    setItems(updatedItems)
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      category: '',
      unit: '',
      purchasePrice: '',
      salePrice: '',
    })
    setEditingItem(null)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      code: item.code,
      category: item.category,
      unit: item.unit,
      purchasePrice: item.purchasePrice.toString(),
      salePrice: item.salePrice.toString(),
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(item => item.id !== id)
      saveItems(updatedItems)
      setItems(updatedItems)
    }
  }

  const openModal = () => {
    resetForm()
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Items Management</h1>
        <button className="btn btn-primary" onClick={openModal}>
          ➕ Add New Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p>No items found. Add your first item to get started.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Purchase Price</th>
                <th>Sale Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.unit}</td>
                  <td>PKR {item.purchasePrice.toFixed(2)}</td>
                  <td>PKR {item.salePrice.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(item)}
                      style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item.id)}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Item Code *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Item Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unit (e.g., kg, pcs, liter)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Purchase Price *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sale Price *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Items

