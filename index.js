const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

let ExpencesTracker = [
  { id: 1, ExpencesType: "ElectricBill", Price: "$15" },
]

app.get('/api/expenses', (req, res) => {
  res.status(200).json(ExpencesTracker)
})

app.get('/api/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const expense = ExpencesTracker.find(e => e.id === id)

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" })
  }

  res.json(expense)
})

app.post('/api/expenses', (req, res) => {
  const { ExpencesType, Price } = req.body

  if (!ExpencesType || !Price) {
    return res.status(400).json({ message: "Missing fields" })
  }

  const newExpense = {
    id: ExpencesTracker.length + 1,
    ExpencesType,
    Price
  }

  ExpencesTracker.push(newExpense)

  res.status(201).json({
    message: "Expense added",
    data: newExpense
  })
})

app.put('/api/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { ExpencesType, Price } = req.body

  const expense = ExpencesTracker.find(e => e.id === id)

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" })
  }

  expense.ExpencesType = ExpencesType || expense.ExpencesType
  expense.Price = Price || expense.Price

  res.json({ message: "Updated", data: expense })
})

app.delete('/api/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = ExpencesTracker.findIndex(e => e.id === id)

  if (index === -1) {
    return res.status(404).json({ message: "Expense not found" })
  }

  ExpencesTracker.splice(index, 1)

  res.json({ message: "Deleted successfully" })
})

app.get('/api/expenses/type/:type', (req, res) => {
  const type = req.params.type

  const result = ExpencesTracker.filter(e =>
    e.ExpencesType.toLowerCase() === type.toLowerCase()
  )

  res.json(result)
})

app.get('/api/search', (req, res) => {
  const type = req.query.type

  if (!type) {
    return res.status(400).json({ message: "Missing search query" })
  }

  const result = ExpencesTracker.filter(e =>
    e.ExpencesType.toLowerCase().includes(type.toLowerCase())
  )

  res.json(result)
})

app.get('/api/random', (req, res) => {
  const random = ExpencesTracker[Math.floor(Math.random() * ExpencesTracker.length)]
  res.json(random)
})

app.get('/api/count', (req, res) => {
  res.json({ total: ExpencesTracker.length })
})

app.get('/api/top', (req, res) => {
  const top = ExpencesTracker.slice(0, 3)
  res.json(top)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})