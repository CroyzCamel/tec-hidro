import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [entryDate, setEntryDate] = useState('')
  const [releaseDate, setReleaseDate] = useState('')

  const [editingId, setEditingId] = useState(null)

  const baseUrl = 'https://tec-hidro.onrender.com/api/persons'

  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setPersons(response.data)
    })
  }, [])

  const limparFormulario = () => {
    setNewName('')
    setNewNumber('')
    setEntryDate('')
    setReleaseDate('')
    setEditingId(null)
  }

  const savePerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      entryDate: entryDate,
      releaseDate: releaseDate
    }

    if (editingId) {
      axios.patch(`${baseUrl}/${editingId}`, personObject).then(response => {
        setPersons(persons.map(p => p.id !== editingId ? p : response.data))
        limparFormulario()
      })
    } else {
      axios.post(baseUrl, personObject).then(res => {
        setPersons(persons.concat(res.data))
      })
    }
  }

  const deletePerson = (id, name) => {
    if (windows.confirm(`Tem certeza que deseja deletar : ${name}`)) {
      axios.delete(`${baseUrl}/${id}`).then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const startEdit = (person) => {
    setNewName(person.name)
    setNewNumber(person.number)
    setEntryDate(person.entryDate || '')
    setReleaseDate(person.releaseDate || '')
    setEditingId(person.id)
  }

  return (
    <div>
      <h1>Tec-Hidro - Gerenciador</h1>

      <form onSubmit={savePerson} style={{ marginBottom: '20px', border: '1px solid #555', padding: '15px' }}>

        <h3>{editingId ? 'Editar Registro' : 'Novo Registro'}</h3>

        <div>Nome: <input value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
        <br />
        <div>Número: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} /></div>
        <br />
        <div>
          Data de Entrada: <input type='date' value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
          <br />
        </div>
        <div>
          <br />
          Data de Saida: <input type='date' value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
          <br />
        </div>
        <br />
        <button type="submit">{editingId ? 'Atualizar no MongoDB' : 'Salvar no MongoDB'}</button>

        {editingId && (
          <button type="button" onClick={limparFormulario} >
            Cancelar
          </button>
        )}

      </form>

      <h2>Registros no Banco de Dados:</h2>
      <ul>
        {persons.map(person => (
          <li key={person.id}>
            <strong>{person.name}</strong> -{person.number} <br />Entrada: {person.entryDate} |
            Saída: {person.releaseDate} <br />


            <button onClick={() => startEdit(person)}>Editar</button>
            <button onClick={() => deletePerson(person.id, person.name)}>Deletar</button>


          </li>
        ))}
      </ul>

    </div>
  )
}

export default App