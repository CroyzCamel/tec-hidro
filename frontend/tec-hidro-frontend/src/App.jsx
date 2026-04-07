import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { useAuth, SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react'


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

  const savePerson = async (event) => { // Adicionamos o 'async' aqui
    event.preventDefault()

    try {
      // 1. Gera o "crachá" de acesso
      const token = await getToken()

      // 2. Cria a configuração de segurança para o Axios
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      const personObject = {
        name: newName,
        number: newNumber,
        entryDate: entryDate,
        releaseDate: releaseDate
      }

      if (editingId) {
        // 1. O token já foi pego no início da função savePerson
        const token = await getToken();
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // 2. Passamos o 'config' como TERCEIRO parâmetro no patch
        await axios.patch(`${baseUrl}/${editingId}`, personObject, config);

        // 3. Atualizamos a lista na tela
        setPersons(persons.map(p => p.id !== editingId ? p : { ...personObject, id: editingId }));
        limparFormulario();
        alert("Registro atualizado com sucesso!");
      } else {
        // 3. Envia o objeto + a configuração de segurança (config)
        const response = await axios.post(baseUrl, personObject, config)
        setPersons(persons.concat(response.data))
        limparFormulario()
      }
    } catch (error) {
      console.error("Erro detalhado:", error);

      // 1. Erro de Autenticação (O segurança barrou)
      if (error.response && error.response.status === 401) {
        alert("Sua sessão expirou ou você não tem permissão. Por favor, saia e faça login novamente.");
      }
      // 2. Erro de Validação (Faltou preencher algo ou nome duplicado)
      else if (error.response && error.response.status === 400) {
        alert("Dados inválidos! Verifique se preencheu o nome e o número corretamente.");
      }
      // 3. Erro de Conexão (Servidor desligado)
      else if (error.code === 'ERR_NETWORK') {
        alert("Não foi possível conectar ao servidor. Verifique se o Back-end está rodando.");
      }
      // 4. Erro Genérico
      else {
        alert("Ops! Ocorreu um erro inesperado ao salvar. Tente novamente mais tarde.");
      }
    }
  }

  const deletePerson = async (id, name) => {
    if (window.confirm(`Tem certeza que deseja deletar o registro: ${name}?`)) {
      try {
        // 1. Gera o crachá de acesso
        const token = await getToken();

        // 2. Cria a configuração de segurança
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // 3. Envia o DELETE com o crachá (config)
        await axios.delete(`${baseUrl}/${id}`, config);

        // 4. Atualiza a tela removendo quem foi deletado
        setPersons(persons.filter(p => p.id !== id));

      } catch (error) {
        console.error("Erro ao deletar:", error);

        if (error.response && error.response.status === 401) {
          alert("Sessão expirada. Faça login novamente para excluir registros.");
        } else {
          alert("Não foi possível excluir o registro no banco de dados.");
        }
      }
    }
  };

  const startEdit = (person) => {
    setNewName(person.name)
    setNewNumber(person.number)
    // Usamos a função aqui para o input não bugar com a hora!
    setEntryDate(dataParaInput(person.entryDate))
    setReleaseDate(dataParaInput(person.releaseDate))
    setEditingId(person.id)
  }

  const dataParaTela = (dataBruta) => {
    if (!dataBruta) return '--/--/----'
    const apenasData = dataBruta.split('T')[0] // Corta no "T"
    const [ano, mes, dia] = apenasData.split('-') // Fica [2026, 04, 03]
    return `${dia}/${mes}/${ano}`
  }

  // 2. Função para o formulário de edição entender a data (YYYY-MM-DD)
  const dataParaInput = (dataBruta) => {
    if (!dataBruta) return ''
    return dataBruta.split('T')[0]
  }



  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-md text-center border border-slate-200 w-full max-w-sm">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">💧 Tec-Hidro</h2>
            <p className="text-slate-500 mb-8 font-medium">Acesso restrito ao Painel</p>

            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-all w-full">
                Fazer Login para Acessar
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>


      <SignedIn>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

          {/* CABEÇALHO (NAVBAR) */}
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

          {/* ÁREA PRINCIPAL */}
          <main className="max-w-7xl mx-auto px-4 py-8">

            {/* GRID DE DUAS COLUNAS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* COLUNA ESQUERDA: FORMULÁRIO */}
              <section className="lg:col-span-1">
                <form
                  onSubmit={savePerson}
                  className="bg-white shadow-sm rounded-xl p-6 border border-slate-200 sticky top-24"
                >
                  <h3 className="text-xl font-bold mb-6 text-slate-700 border-b border-slate-100 pb-3">
                    {editingId ? '✏️ Editar Registro' : '➕ Novo Registro'}
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Nome</label>
                      <input
                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                        placeholder="Atac. Fortaleza..."
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Número / Código</label>
                      <input
                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                        placeholder="Ex: POT / REF / AGE/ SGV "
                        value={newNumber}
                        onChange={(e) => setNewNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Entrada</label>
                        <input
                          type="date"
                          className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-slate-700"
                          value={entryDate}
                          onChange={(e) => setEntryDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Saída</label>
                        <input
                          type="date"
                          className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-slate-700"
                          value={releaseDate}
                          onChange={(e) => setReleaseDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="submit"
                      className={`w-full py-2.5 rounded-lg font-bold text-white shadow-sm transition-all duration-200 ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                      {editingId ? 'Atualizar no Banco' : 'Salvar no Banco'}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        onClick={limparFormulario}
                        className="w-full py-2.5 rounded-lg font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all duration-200"
                      >
                        Cancelar Edição
                      </button>
                    )}
                  </div>
                </form>
              </section>

              {/* COLUNA DIREITA: LISTA DE DADOS */}
              <section className="lg:col-span-2">
                <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Registros Ativos</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {persons.length} {persons.length === 1 ? 'item' : 'itens'}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {persons.map(person => (
                        <div key={person.id} className="bg-white border border-slate-200 p-5 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group">

                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <strong className="text-lg text-slate-800 block leading-tight">{person.name}</strong>
                              <span className="text-sm text-slate-500 font-medium">Cód: {person.number}</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 mb-4 border border-slate-100">
                            <div className="flex justify-between mb-1">
                              <span className="font-semibold text-slate-700">Entrada:</span>
                              <span>{dataParaTela(person.entryDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-slate-700">Saída:</span>
                              <span>{dataParaTela(person.releaseDate)}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEdit(person)}
                              className="flex-1 bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 py-1.5 rounded-lg font-semibold transition-colors text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deletePerson(person.id, person.name)}
                              className="flex-1 bg-slate-100 text-slate-700 hover:bg-red-100 hover:text-red-700 py-1.5 rounded-lg font-semibold transition-colors text-sm"
                            >
                              Excluir
                            </button>
                          </div>

                        </div>
                      ))}

                      {persons.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-500">
                          Nenhum registro encontrado no banco de dados.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </main>
        </div>
      </SignedIn>

    </>
  )
}

export default App