import { useState } from 'react';
import DatePicker from './DatePicker';
import Avatar from './Avatar';

export default function ComponentExamples() {
  const [selectedDate, setSelectedDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="p-8 space-y-12 max-w-4xl">
      {/* DatePicker Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">DatePicker Component</h2>

        <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          {/* Exemplo básico */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Básico</h3>
            <DatePicker
              label="Data de Nascimento"
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Selecione uma data"
            />
            <p className="text-sm text-gray-600 mt-2">
              Data selecionada: {selectedDate || 'Nenhuma'}
            </p>
          </div>

          {/* Exemplo com validação */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Com Validação</h3>
            <DatePicker
              label="Data do Evento"
              value={startDate}
              onChange={setStartDate}
              required
              error={!startDate ? 'Este campo é obrigatório' : undefined}
            />
          </div>

          {/* Exemplo com limites */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Com Data Mínima e Máxima</h3>
            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                label="Data de Início"
                value={startDate}
                onChange={setStartDate}
                minDate="2024-01-01"
                maxDate="2024-12-31"
              />
              <DatePicker
                label="Data de Término"
                value={endDate}
                onChange={setEndDate}
                minDate={startDate || "2024-01-01"}
                disabled={!startDate}
              />
            </div>
          </div>

          {/* Exemplo desabilitado */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Desabilitado</h3>
            <DatePicker
              label="Data Desabilitada"
              value="2024-01-01"
              disabled
            />
          </div>
        </div>
      </section>

      {/* Avatar Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Avatar Component</h2>

        <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          {/* Tamanhos */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Tamanhos</h3>
            <div className="flex items-end gap-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar name="João Silva" size="xs" />
                <span className="text-xs text-gray-600">xs</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="João Silva" size="sm" />
                <span className="text-xs text-gray-600">sm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="João Silva" size="md" />
                <span className="text-xs text-gray-600">md</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="João Silva" size="lg" />
                <span className="text-xs text-gray-600">lg</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="João Silva" size="xl" />
                <span className="text-xs text-gray-600">xl</span>
              </div>
            </div>
          </div>

          {/* Com iniciais */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Com Iniciais</h3>
            <div className="flex items-center gap-4">
              <Avatar name="Maria Santos" size="lg" />
              <Avatar name="Pedro Oliveira" size="lg" />
              <Avatar name="Ana" size="lg" />
              <Avatar name="Carlos Eduardo Silva" size="lg" />
            </div>
          </div>

          {/* Com imagem */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Com Imagem</h3>
            <div className="flex items-center gap-4">
              <Avatar
                src="https://i.pravatar.cc/150?img=1"
                name="Usuário 1"
                size="lg"
              />
              <Avatar
                src="https://i.pravatar.cc/150?img=2"
                name="Usuário 2"
                size="lg"
              />
              <Avatar
                src="https://i.pravatar.cc/150?img=3"
                name="Usuário 3"
                size="lg"
              />
            </div>
          </div>

          {/* Sem informações (ícone padrão) */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Sem Informações</h3>
            <div className="flex items-center gap-4">
              <Avatar size="lg" />
              <Avatar size="lg" fallbackColor="bg-blue-100" />
              <Avatar size="lg" fallbackColor="bg-green-100" />
            </div>
          </div>

          {/* Clicável */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Clicável</h3>
            <div className="flex items-center gap-4">
              <Avatar
                name="João Silva"
                size="lg"
                onClick={() => alert('Avatar clicado!')}
              />
              <Avatar
                src="https://i.pravatar.cc/150?img=4"
                name="Maria Santos"
                size="lg"
                onClick={() => alert('Avatar clicado!')}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">Clique nos avatares acima</p>
          </div>
        </div>
      </section>

      {/* Exemplo de Uso em Formulário */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Exemplo: Formulário de Perfil</h2>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Avatar do usuário */}
            <div className="flex items-center gap-4">
              <Avatar
                src="https://i.pravatar.cc/150?img=5"
                name="Maria Silva"
                size="xl"
              />
              <div>
                <h3 className="font-semibold text-gray-900">Maria Silva</h3>
                <p className="text-sm text-gray-600">maria.silva@example.com</p>
                <button type="button" className="text-sm text-primary-600 hover:text-primary-700 mt-1">
                  Alterar foto
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  defaultValue="Maria Silva"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <DatePicker
                label="Data de Nascimento"
                value="1990-05-15"
                onChange={(date) => console.log('Data alterada:', date)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                label="Data de Admissão"
                value="2020-03-01"
                onChange={(date) => console.log('Data alterada:', date)}
                required
              />

              <DatePicker
                label="Vencimento do Contrato"
                value="2025-03-01"
                onChange={(date) => console.log('Data alterada:', date)}
                minDate="2024-01-01"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
