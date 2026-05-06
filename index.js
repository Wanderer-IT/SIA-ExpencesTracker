const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
res.send('API is running. Use /api/expenses')
})

let expenses = [
{ id: 1, type: "ElectricBill", price: 15, status: "unpaid" },
{ id: 2, type: "WaterBill", price: 10, status: "unpaid" },
{ id: 3, type: "InternetBill", price: 25, status: "unpaid" },
{ id: 4, type: "Groceries", price: 60, status: "unpaid" },
{ id: 5, type: "Transport", price: 20, status: "unpaid" },
{ id: 6, type: "Rent", price: 300, status: "unpaid" },
{ id: 7, type: "Load", price: 5, status: "unpaid" },
{ id: 8, type: "FoodDelivery", price: 18, status: "unpaid" },
{ id: 9, type: "SchoolSupplies", price: 12, status: "unpaid" },
{ id: 10, type: "Entertainment", price: 15, status: "unpaid" }
]

function generateId() {
return expenses.length > 0
? Math.max(...expenses.map(e => e.id)) + 1
: 1
}

app.get('/api/expenses', (req, res) => {
res.json(expenses)
})

app.get('/api/expenses/:id', (req, res) => {
const id = Number(req.params.id)
const expense = expenses.find(e => e.id === id)

if (!expense) {
return res.status(404).json({ message: "Expense not found" })
}

res.json(expense)
})

app.post('/api/expenses', (req, res) => {
const { type, price, status } = req.body

if (!type || price === undefined) {
return res.status(400).json({ message: "type and price are required" })
}

const newExpense = {
id: generateId(),
type: type,
price: Number(price),
status: status || "unpaid"
}

expenses.push(newExpense)

res.status(201).json({
message: "Expense added",
data: newExpense
})
})

app.put('/api/expenses/:id', (req, res) => {
const id = Number(req.params.id)
const expense = expenses.find(e => e.id === id)

if (!expense) {
return res.status(404).json({ message: "Expense not found" })
}

const { type, price, status } = req.body

if (type !== undefined) expense.type = type
if (price !== undefined) expense.price = Number(price)
if (status !== undefined) expense.status = status

res.json({
message: "Updated successfully",
data: expense
})
})

app.delete('/api/expenses/:id', (req, res) => {
const id = Number(req.params.id)
const index = expenses.findIndex(e => e.id === id)

if (index === -1) {
return res.status(404).json({ message: "Expense not found" })
}

const deleted = expenses.splice(index, 1)

res.json({
message: "Deleted successfully",
data: deleted[0]
})
})

app.get('/api/expenses/type/:type', (req, res) => {
const type = req.params.type

const result = expenses.filter(e =>
e.type.toLowerCase() === type.toLowerCase()
)

res.json(result)
})

app.get('/api/search', (req, res) => {
const type = req.query.type

if (!type) {
return res.status(400).json({ message: "Missing search query" })
}

const result = expenses.filter(e =>
e.type.toLowerCase().includes(type.toLowerCase())
)

res.json(result)
})

app.get('/api/random', (req, res) => {
if (expenses.length === 0) {
return res.status(404).json({ message: "No expenses found" })
}

const random = expenses[Math.floor(Math.random() * expenses.length)]
res.json(random)
})

app.get('/api/count', (req, res) => {
res.json({ total: expenses.length })
})

app.get('/api/top', (req, res) => {
res.json(expenses.slice(0, 3))
})

app.listen(port, () => {
console.log(`Server running on port ${port}`)
})