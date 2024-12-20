const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// const users = []

const users = [] // Lista użytkowników
const logs = [] // Lista ćwiczeń

// Endpoint do dodawania użytkownika
app.post('/api/users', (req, res) => {
  const newUser = {
    _id: Date.now().toString(), // Proste generowanie ID
    username: req.body.username,
  }
  users.push(newUser)
  res.json(newUser)
})

// Endpoint do dodawania ćwiczenia
app.post('/api/users/:_id/exercises', (req, res) => {
  const userId = req.params._id
  const user = users.find((user) => user._id === userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const { description, duration, date } = req.body
  const exerciseDate = date ? new Date(date) : new Date()
  const newLog = {
    _id: userId,
    username: user.username,
    description,
    duration: parseInt(duration),
    date: exerciseDate.toDateString(),
  }
  logs.push(newLog)
  res.json(newLog)
})
app.get('/api/users', (req, res) => {
  res.json(users)
})
// Endpoint do pobierania logów użytkownika
app.get('/api/users/:_id/logs', (req, res) => {
  const userId = req.params._id
  const user = users.find((user) => user._id === userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const { from, to, limit } = req.query

  // Filtrujemy logi dla konkretnego użytkownika
  let userLogs = logs.filter((log) => log._id === userId)

  // Filtracja na podstawie `from` i `to`
  if (from) {
    const fromDate = new Date(from)
    userLogs = userLogs.filter((log) => new Date(log.date) >= fromDate)
  }
  if (to) {
    const toDate = new Date(to)
    userLogs = userLogs.filter((log) => new Date(log.date) <= toDate)
  }

  // Ograniczenie wyników na podstawie `limit`
  if (limit) {
    userLogs = userLogs.slice(0, parseInt(limit))
  }

  // Przygotowanie odpowiedzi
  const response = {
    _id: userId,
    username: user.username,
    count: userLogs.length,
    log: userLogs.map(({ description, duration, date }) => ({
      description,
      duration,
      date,
    })),
  }

  res.json(response)
})
// app.post('/api/users', (req, res) => {
//   const { username } = req.body

//   // Validate the username field
//   if (!username) {
//     return res.status(400).json({ error: 'Username is required' })
//     logs: []
//   }

//   // Simulate a new user creation
//   const newUser = {
//     username,
//     _id: Math.random().toString(36).substr(2, 9), // Generate a random ID
//   }
//   users.push(newUser)
//   // Send response in expected format
//   res.json(newUser)
// })
// app.get('/api/users', (req, res) => {
//   res.json([
//     { username: 'John Doe', _id: '123' },
//     { username: 'Jane Doe', _id: '456' },
//   ])
// })

// app.post('/api/users/:_id/exercises', async (req, res) => {
//   const userId = req.params._id
//   const user = users.find((user) => user._id === userId)
//   if (!user) {
//     return res.status(404).json({ error: 'User not found' })
//   }
//   const { description, duration, date, username } = req.body

//   const expected = {
//     username: user.username,
//     description: 'test',
//     duration: 60,
//     _id: userId,
//     date: 'Mon Jan 01 1990',
//   }

//   res.json(expected)
// })
// setInterval(() => {
//   console.log(users)
// }, 5000)

// setInterval(() => {
//   console.log(logs)
// }, 75000)

// const logs = []
// app.get('/api/users/:_id/logs', async (req, res) => {
//   const userId = req.params._id
//   const user = users.find((user) => user._id === userId)
//   if (!user) {
//     return res.status(404).json({ error: 'User not found' })
//   }

//   const { from, to, limit } = req.query
//   })

app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + process.env.PORT || 3000)
})
