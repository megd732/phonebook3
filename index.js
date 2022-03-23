const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token("json", (req, res) => {
    const {body} = req // why does this work lol
    return JSON.stringify(body)
})

app.use(express.json()) // express json parser
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

const generateId = () => {
    return Math.floor(Math.random() * 1000)
}

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>PEOPLE!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id) 
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log('here')
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name) {
        return response.status(400).json({
            error: 'name must be supplied'
        })
    } else if(!body.number) {
        return response.status(400).json({
            error: 'number must be supplied'
        })
    } else if(persons.some(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'this person is already in the phone book.'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    console.log(person)
    response.json(person)

})

app.get('/api/info', (request, response) => {
    response.send(`phone book has info for ${persons.length} people <br/> ${Date()}`)
    console.log(persons.length)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})