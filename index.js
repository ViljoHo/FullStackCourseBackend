const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('reqBodyContent', (req, res) => {
    console.log(req.body)

    if(JSON.stringify(req.body) !== '{}'){
        return JSON.stringify(req.body)
    }else {
        return ''
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBodyContent'))

const getRandomId = (max) => {
    return Math.floor(Math.random() * max)
}


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
    
]

app.get('/', (req, res) => {
    res.send("hello worldff\nmorooo")
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    const newName = body.name
    const newNumber = body.number

    if (newName === null || persons.some(({name}) => name === newName) || newName === "") {
        return res.status(400).json({
            error: 'there has to be name or it must be unique'
        })
    }

    if (newNumber == null || newNumber === "") {
        return res.status(400).json({
            error: 'there has to be number'
        })
    }

    const newPersonObj = {
        name: newName,
        number: newNumber,
        id: getRandomId(100000),
    }

    persons = persons.concat(newPersonObj)

    res.json(newPersonObj)

})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people <br/> ${new Date()}`)
})

const PORT = process.env.PORT || 3001
const test = process.env.TEST
console.log(test)
console.log(PORT)
app.listen(test, () => {
    console.log(`Server running on port ${test}`)
})