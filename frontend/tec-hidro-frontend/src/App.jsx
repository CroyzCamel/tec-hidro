import { useState, useEffect } from 'react'
import './App.css'
import { useAuth, SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import clientService from './services/clients'
import ClientList from './components/ClientList'
import ClientForm from './components/ClientForm'

const App = () => {

  const { getToken } = useAuth()

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [entryDate, setEntryDate] = useState('')
  const [releaseDate, setReleaseDate] = useState('')

  const [editingId, setEditingId] = useState(null)

  const baseUrl = 'https://tec-hidro.onrender.com/api/persons'

  useEffect(() => {
    clientService.getAll().then(initialClients => {
      setPersons(initialClients)
    })
  }, [])

  const limparFormulario = () => {
    setNewName('')
    setNewNumber('')
    setEntryDate('')
    setReleaseDate('')
    setEditingId(null)
  }

  const savePerson = async (event) => {
    event.preventDefault()

    try {
      const token = await getToken()

      const personObject = {
        name: newName,
        number: newNumber,
        entryDate: entryDate,
        releaseDate: releaseDate
      }

      if (editingId) {
        await clientService.update(editingId, personObject, token)

        setPersons(persons.map(p => p.id !== editingId ? p : { ...personObject, id: editingId }));
        limparFormulario();
        alert("Registro atualizado com sucesso!");

      } else {

        const returnedPerson = await clientService.create(personObject, token)

        setPersons(persons.concat(returnedPerson))
        limparFormulario()
      }
    } catch (error) {
      console.error("Erro detalhado:", error);

      if (error.response && error.response.status === 401) {
        alert("Sua sessão expirou ou você não tem permissão. Por favor, saia e faça login novamente.");
      }
      else if (error.response && error.response.status === 400) {
        alert("Dados inválidos! Verifique se preencheu o nome e o número corretamente.");
      }
      else if (error.code === 'ERR_NETWORK') {
        alert("Não foi possível conectar ao servidor. Verifique se o Back-end está rodando.");
      }
      else {
        alert("Ops! Ocorreu um erro inesperado ao salvar. Tente novamente mais tarde.");
      }
    }
  }

  const deletePerson = async (id, name) => {
    if (window.confirm(`Tem certeza que deseja deletar o registro: ${name}?`)) {
      try {
        const token = await getToken();

        await clientService.remove(id, token)

        setPersons(persons.filter(p => p.id !== id));
        alert("Registro excluído com sucesso!")

      } catch (error) {
        console.error("Erro ao deletar:", error);

        if (error.response && error.response.status === 401) {
          alert("Sessão expirada. Faça login novamente para excluir registros.");
        } else if (error.code === 'ERR_NETWORK') {
          alert("Não foi possível conectar ao servidor.");
        } else {
          alert("Não foi possível excluir o registro no momento.");
        }
      }
    }
  };

  const startEdit = (person) => {
    setNewName(person.name)
    setNewNumber(person.number)
    setEntryDate(dataParaInput(person.entryDate))
    setReleaseDate(dataParaInput(person.releaseDate))
    setEditingId(person.id)
  }

  const dataParaTela = (dataBruta) => {
    if (!dataBruta) return '--/--/----'
    const apenasData = dataBruta.split('T')[0]
    const [ano, mes, dia] = apenasData.split('-')
    return `${dia}/${mes}/${ano}`
  }

  const dataParaInput = (dataBruta) => {
    if (!dataBruta) return ''
    return dataBruta.split('T')[0]
  }



  return (
    <>
      <SignedOut>
        <div className="min-h-[80vh] flex flex-col items-center justify-center">

          <div className="bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center max-w-md w-full text-center border border-slate-100">

            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">💧</span>
            </div>

            <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Tec-Hidro</h1>
            <p className="text-slate-500 mb-8">Acesso restrito ao painel gerencial.</p>

            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all w-full text-lg">
                Fazer Login para Acessar
              </button>
            </SignInButton>

          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

          <header className="bg-blue-900 text-white shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <SignOutButton>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow transition-all text-sm">
                  Sair do Sistema
                </button>
              </SignOutButton>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                💧 Controle de clientes <span className="hidden sm:inline text-sm font-light text-blue-200">| Painel Gerencial</span>
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Carlyle Camelo</span>
                <div className="w-8 h-8 bg-blue-700 rounded-full border-2 border-white-400"></div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <section className="lg:col-span-1">
                <ClientForm
                  savePerson={savePerson}
                  editingId={editingId}
                  newName={newName} setNewName={setNewName}
                  newNumber={newNumber} setNewNumber={setNewNumber}
                  entryDate={entryDate} setEntryDate={setEntryDate}
                  releaseDate={releaseDate} setReleaseDate={setReleaseDate}
                  limparFormulario={limparFormulario}
                />
              </section>

              <section className="lg:col-span-2">
                <ClientList
                  persons={persons}
                  startEdit={startEdit}
                  deletePerson={deletePerson}
                  dataParaTela={dataParaTela}
                />
              </section>

            </div>
          </main>
        </div>
      </SignedIn>

    </>
  )
}

export default App