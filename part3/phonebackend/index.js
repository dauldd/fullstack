const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')


app.use(cors())
app.use(express.json())
morgan.token('custom', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom'))

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

let notes = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": "5",
      "name": "Daul Rinne", 
      "number": "19-23-6423122"
    }
]

const generateID = () => {

    let id 
    do {
        id = Math.floor(Math.random() *100000) + 1
        id = id.toString()

    
    } while (notes.some(note => note.id === id))
    return id

}

app.get('/api/persons', (request, response) => {

  response.json(notes)
})

app.get('/info', (request, response) => {
  const totalPeople=notes.length
  const date = new Date()

  response.send(
    `<p>Phonebook has info for ${totalPeople} people</p><p>${date}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id 
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()

})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({error: 'please add name'})    
  }
  if (!body.number) {
    return response.status(400).json({error: 'please add number'})    
  }

  const PersonExists=notes.find(person => person.name === body.name)
  if (PersonExists) {
    return response.status(400).json({error: "name already exist"})
  }

    const person = {
    id: generateID(),
    name: body.name,
    number: body.number
  }

  notes = notes.concat(person)
  response.json(person)

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})