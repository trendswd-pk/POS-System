# Migration Guide: Updating Pages for Async/Await

All storage functions are now async. You need to update all pages to use `await` when calling storage functions.

## Example Changes

### Before:
```javascript
const loadItems = () => {
  const loadedItems = getItems()
  setItems(loadedItems)
}

const handleSubmit = (e) => {
  e.preventDefault()
  // ... code ...
  saveItems(updatedItems)
  setItems(updatedItems)
}
```

### After:
```javascript
const loadItems = async () => {
  const loadedItems = await getItems()
  setItems(loadedItems)
}

const handleSubmit = async (e) => {
  e.preventDefault()
  // ... code ...
  await saveItems(updatedItems)
  setItems(updatedItems)
}
```

## Pages to Update:
1. Items.jsx
2. StockPurchase.jsx
3. StockReturn.jsx
4. Sale.jsx
5. SaleReturn.jsx
6. ClosingStock.jsx
7. Users.jsx
8. Login.jsx

## Important Notes:
- All `get*` functions now return promises - use `await`
- All `save*` functions now return promises - use `await`
- `useEffect` callbacks can't be async directly - create async functions inside
- All event handlers that call storage functions should be async

