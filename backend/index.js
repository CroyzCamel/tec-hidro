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
    entryDate: Date,
    releaseDate: Date,
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

    if (!body.name || !body.number || !body.entryDate || !body.releaseDate) {
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
        .catch(error => {
            console.log(error)
            res.status(500).send({ error: 'Erro ao salvar os dados' })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then(res => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            console.log("Erro real do Mongoose:", error.message)
            res.status(400).send({ error: 'Erro ao deletar: ID mal formatado' })
        })
})

app.patch('/api/persons/:id', (req, res) => {
    const body = req.body

    Person.findByIdAndUpdate(req.params.id, body, { new: true })
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson)
            } else {
                res.status(400).json({ error: 'Registro não encontrado' })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'Erro ao atualizar registro' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})