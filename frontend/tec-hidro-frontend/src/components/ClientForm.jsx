import React from 'react'

const ClientForm = ({
  savePerson, editingId, 
  newName, setNewName, 
  newNumber, setNewNumber, 
  entryDate, setEntryDate, 
  releaseDate, setReleaseDate, 
  limparFormulario
}) => {
  return (
    <form
      onSubmit={savePerson}
      className="bg-white shadow-sm rounded-xl p-6 border border-slate-200 sticky top-24"
    >
      <h3 className="text-xl font-bold mb-6 text-slate-700 border-b border-slate-100 pb-3">
        {editingId ? '✏️ Editar Registro' : '➕ Novo Registro'}
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Cliente</label>
          <input
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
            placeholder="Atac. Fortaleza..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Tipo de Sistema</label>
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
          className={`w-full py-2.5 rounded-lg font-bold text-white shadow-sm transition-all duration-200 ${
            editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
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
  )
}

export default ClientForm