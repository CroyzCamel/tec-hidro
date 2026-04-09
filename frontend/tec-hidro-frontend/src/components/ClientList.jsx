import React from 'react'

const ClientList = ({ persons, startEdit, deletePerson, dataParaTela }) => {
  return (
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
                  <span className="text-sm text-slate-500 font-medium">Tipo de sistema: {person.number}</span>
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
  )
}

export default ClientList