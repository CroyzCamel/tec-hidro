require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')


const app = express()

app.use(cors())
app.use(express.json())

const url = process.env.MONGODB_URI
console.log('conectando a', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => { console.log('conectado ao MongoDB') })
    .catch((error) => { console.log('erro ao conectar ao MongoDB:', error.message) })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    entryDate: String,
    releaseDate: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'Nome ou número faltando' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        entryDate: body.entryDate,
        releaseDate: body.releaseDate, 
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})