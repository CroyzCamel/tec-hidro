import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [entryDate, setEntryDate] = useState('')
  const [releaseDate, setReleaseDate] = useState('')

  const baseUrl = 'https://tec-hidro.onrender.com/api/persons'

  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setPersons(response.data)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }

    axios.post(baseUrl, personObject).then(response => {
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
    })
  }

  return (
    <div>
      <h1>Tec-Hidro - Gerenciador</h1>

      <form onSubmit={addPerson} style={{ marginBottom: '20px', border: '1px solid #555', padding: '15px' }}>
        <h3>Novo Registro</h3>
        <div>Nome: <input value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
        <br />
        <div>Número: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} /></div>
        <br />
        <div>
          Data de Entrada: <input value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
        </div>
        <div>
          Data de Saida: <input value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
        </div>
        <button type="submit">Salvar no MongoDB</button>
      </form>

      <h2>Registros no Banco de Dados:</h2>
      <ul>
        {persons.map(person => (
          <li key={person.id}>{person.name}: {person.number}</li>
        ))}
      </ul>
    </div>
  )
}

export default App