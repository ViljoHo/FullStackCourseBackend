require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

//Model
const Person = require('./models/person')

morgan.token('reqBodyContent', (req, res) => {
    console.log(req.body)

    if(JSON.stringify(req.body) !== '{}'){
        return JSON.stringify(req.body)
    }else {
        return ''
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBodyContent'))


// const getRandomId = (max) => {
//     return Math.floor(Math.random() * max)
// }


// let persons = [
//     {
//         id: 1,
//         name: "Arto Hellas",
//         number: "040-123456"
//     },
//     {
//         id: 2,
//         name: "Ada Lovelace",
//         number: "39-44-5323523"
//     },
//     {
//         id: 3,
//         name: "Dan Abramov",
//         number: "12-43-234345"
//     },
//     {
//         id: 4,
//         name: "Mary Poppendick",
//         number: "39-23-6423122"
//     }

// ]

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {

    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))

})



//own function which check is there already new name
const hasName = (newName) => {
    const nameExists = Person.find({ name: newName }).then(result => {
        //result is empty if there is no name like newName
        if (result.length > 0) {
            return true
        } else {
            return false
        }
    })
    return nameExists
}

app.post('/api/persons', async (req, res, next) => {
    const body = req.body

    const newName = body.name
    const newNumber = body.number

    //never true with phonebook frontend, because there is that editing feature
    //usefull tho, if called post method from somewhere else
    const nameExists = await hasName(newName)

    if (newName === null || nameExists || newName === '') {
        return res.status(400).json({
            error: 'there has to be name or it must be unique'
        })
    }

    if (newNumber === null || newNumber === '') {
        return res.status(400).json({
            error: 'there has to be number'
        })
    }

    const person = new Person({
        name: newName,
        number: newNumber,
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    console.log(body)

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))

})

app.get('/info', (req, res) => {
    Person.find({}).then(people => {
        res.send(`Phonebook has info for ${people.length} people <br/> ${new Date()}`)
    })
})

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)

}

app.use(errorHandler)

const PORT = process.env.PORT


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})