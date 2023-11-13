const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

//task 3.20: not sure if it should allow min 8 character or number
//"-" counted to that 8
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                if (v.length < 8) {
                    return false
                }
                return /\d{2,3}-\d*/.test(v) && /^\d{2,3}-\d*$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number! Correct form: 12-34567 or 123-4567`
        },
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})


module.exports = mongoose.model('Person', personSchema)