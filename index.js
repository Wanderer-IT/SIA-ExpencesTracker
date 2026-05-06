const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

let ExpencesTracker = [
{ id: 1, name: "Wanderer", CharType: "Wind" },
{ id: 2, name: "Shin", CharType: "Lightning" },
{ id: 3, name: "Acheron", CharType: "Lightning" },
{ id: 4, name: "Kafka", CharType: "Lightning" },
{ id: 5, name: "Blade", CharType: "Wind" },
{ id: 6, name: "Seele", CharType: "Quantum" },
{ id: 7, name: "Bronya", CharType: "Wind" },
{ id: 8, name: "Himeko", CharType: "Fire" },
{ id: 9, name: "March 7th", CharType: "Ice" },
{ id: 10, name: "Dan Heng", CharType: "Wind" }
]

app.get('/api/ExpencesTracker', (req, res) => {
res.status(200).json(ExpencesTracker)
})

app.get('/api/ExpencesTracker/:id', (req, res) => {
const id = parseInt(req.params.id)
const char = ExpencesTracker.find(c => c.id === id)

if (!char) {
    return res.status(404).json({ message: "Character not found" })
}

res.json(char)

})

app.post('/api/ExpencesTracker', (req, res) => {
const { name, CharType } = req.body

if (!name || !CharType) {
    return res.status(400).json({ message: "Missing fields" })
}

const newChar = {
    id: HsrCharacters.length + 1,
    name,
    CharType
}

HsrCharacters.push(newChar)

res.status(201).json({
    message: "Expences added",
    data: newChar
})

})

app.put('/api/ExpencesTracker/:id', (req, res) => {
const id = parseInt(req.params.id)
const { name, CharType } = req.body

const char = ExpencesTracker.find(c => c.id === id)

if (!char) {
    return res.status(404).json({ message: "Character not found" })
}

char.name = name || char.name
char.CharType = CharType || char.CharType

res.json({ message: "Updated", data: char })

})

app.delete('/api/ExpencesTracker/:id', (req, res) => {
const id = parseInt(req.params.id)
const index = ExpencesTracker.findIndex(c => c.id === id)

if (index === -1) {
    return res.status(404).json({ message: "Expences not found" })
}

ExpencesTracker.splice(index, 1)

res.json({ message: "Deleted successfully" })

})

app.get('/api/ExpencesTracker/type/:type', (req, res) => {
const type = req.params.type
const result = HsrCharacters.filter(c =>
c.CharType.toLowerCase() === type.toLowerCase()
)

res.json(result)

})

app.get('/api/search', (req, res) => {
const name = req.query.name

if (!name) {
    return res.status(400).json({ message: "Missing search query" })
}

const result = HsrCharacters.filter(c =>
    c.name.toLowerCase().includes(name.toLowerCase())
)

res.json(result)

})

app.get('/api/random', (req, res) => {
const random = HsrCharacters[Math.floor(Math.random() * HsrCharacters.length)]
res.json(random)
})

app.get('/api/count', (req, res) => {
res.json({ total: HsrCharacters.length })
})

app.get('/api/top', (req, res) => {
const top = HsrCharacters.slice(0, 3)
res.json(top)
})

app.listen(port, () => {
console.log(`Server running on https://dublin-sia-app.onrender.com`)
})