import React from 'react'

const ClientList = ({ persons, startEdit, deletePerson, dataParaTela }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
      
      {/* Cabeçalho da Tabela */}
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Registros Ativos</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          {persons.length} {persons.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {/* Container com scroll horizontal (Salva a vida no celular!) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          
          {/* Títulos das Colunas */}
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Entrada</th>
              <th className="px-6 py-4">Saída</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          
          {/* Corpo da Tabela (Linhas) */}
          <tbody className="divide-y divide-slate-100">
            {persons.map(person => (
              <tr 
                key={person.id} 
                className="hover:bg-blue-50 transition-colors even:bg-slate-50/50"
              >
                {/* Cliente */}
                <td className="px-6 py-4 font-semibold text-slate-800">
                  {person.name}
                </td>
                
                {/* Tipo (com um visual de "etiqueta") */}
                <td className="px-6 py-4">
                  <span className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold">
                    {person.number}
                  </span>
                </td>
                
                {/* Datas */}
                <td className="px-6 py-4">{dataParaTela(person.entryDate)}</td>
                <td className="px-6 py-4">{dataParaTela(person.releaseDate)}</td>
                
                {/* Botões de Ação */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => startEdit(person)}
                      className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deletePerson(person.id, person.name)}
                      className="text-red-600 hover:text-red-800 font-semibold hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mensagem se estiver vazio */}
        {persons.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            Nenhum registro encontrado no banco de dados.
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientList