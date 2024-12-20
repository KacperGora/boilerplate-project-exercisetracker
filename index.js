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


const users = [] 
const logs = [] 

app.post('/api/users', (req, res) => {
  const newUser = {
    _id: Date.now().toString(),
    username: req.body.username,
  }
  users.push(newUser)
  res.json(newUser)
})

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

app.get('/api/users/:_id/logs', (req, res) => {
  const userId = req.params._id
  const user = users.find((user) => user._id === userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const { from, to, limit } = req.query

  let userLogs = logs.filter((log) => log._id === userId)

  if (from) {
    const fromDate = new Date(from)
    userLogs = userLogs.filter((log) => new Date(log.date) >= fromDate)
  }
  if (to) {
    const toDate = new Date(to)
    userLogs = userLogs.filter((log) => new Date(log.date) <= toDate)
  }

  if (limit) {
    userLogs = userLogs.slice(0, parseInt(limit))
  }

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

app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + process.env.PORT || 3000)
})
