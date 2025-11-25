import { useState } from 'react';
import Tag, { StatusTag, PriorityTag, CategoryTag } from './Tag';
import { Star, Zap, Clock, User } from 'lucide-react';

export default function TagExamples() {
  const [selectedTags, setSelectedTags] = useState<string[]>(['React', 'TypeScript']);

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  return (
    <div className="p-8 space-y-12 max-w-6xl">
      {/* Seção de Componentes Específicos */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Componentes de Tag - Casos de Uso
        </h2>

        {/* StatusTag */}
        <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              StatusTag - Tags de Status
            </h3>
            <div className="flex flex-wrap gap-3">
              <StatusTag status="pending" />
              <StatusTag status="in_progress" />
              <StatusTag status="completed" />
              <StatusTag status="paused" />
              <StatusTag status="cancelled" />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              ✅ Aceite: Renderiza "Em Andamento"
            </p>
          </div>

          {/* StatusTag Outlined */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              StatusTag - Versão Outlined
            </h3>
            <div className="flex flex-wrap gap-3">
              <StatusTag status="pending" outlined />
              <StatusTag status="in_progress" outlined />
              <StatusTag status="completed" outlined />
              <StatusTag status="paused" outlined />
              <StatusTag status="cancelled" outlined />
            </div>
          </div>

          {/* PriorityTag */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              PriorityTag - Tags de Prioridade
            </h3>
            <div className="flex flex-wrap gap-3">
              <PriorityTag priority="low" />
              <PriorityTag priority="medium" />
              <PriorityTag priority="high" />
              <PriorityTag priority="urgent" />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              ✅ Aceite: Renderiza "Alta"
            </p>
          </div>

          {/* PriorityTag Outlined */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              PriorityTag - Versão Outlined
            </h3>
            <div className="flex flex-wrap gap-3">
              <PriorityTag priority="low" outlined />
              <PriorityTag priority="medium" outlined />
              <PriorityTag priority="high" outlined />
              <PriorityTag priority="urgent" outlined />
            </div>
          </div>
        </div>
      </section>

      {/* Tamanhos */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Tamanhos</h2>

        <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              StatusTag - Diferentes Tamanhos
            </h3>
            <div className="flex items-center gap-3">
              <StatusTag status="in_progress" size="sm" />
              <StatusTag status="in_progress" size="md" />
              <StatusTag status="in_progress" size="lg" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              PriorityTag - Diferentes Tamanhos
            </h3>
            <div className="flex items-center gap-3">
              <PriorityTag priority="high" size="sm" />
              <PriorityTag priority="high" size="md" />
              <PriorityTag priority="high" size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Variantes de Cores */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Variantes de Cores</h2>

        <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Preenchidas</h3>
            <div className="flex flex-wrap gap-3">
              <Tag variant="default">Default</Tag>
              <Tag variant="primary">Primary</Tag>
              <Tag variant="success">Success</Tag>
              <Tag variant="warning">Warning</Tag>
              <Tag variant="danger">Danger</Tag>
              <Tag variant="info">Info</Tag>
              <Tag variant="purple">Purple</Tag>
              <Tag variant="pink">Pink</Tag>
              <Tag variant="orange">Orange</Tag>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Outlined</h3>
            <div className="flex flex-wrap gap-3">
              <Tag variant="default" outlined>
                Default
              </Tag>
              <Tag variant="primary" outlined>
                Primary
              </Tag>
              <Tag variant="success" outlined>
                Success
              </Tag>
              <Tag variant="warning" outlined>
                Warning
              </Tag>
              <Tag variant="danger" outlined>
                Danger
              </Tag>
              <Tag variant="info" outlined>
                Info
              </Tag>
              <Tag variant="purple" outlined>
                Purple
              </Tag>
              <Tag variant="pink" outlined>
                Pink
              </Tag>
              <Tag variant="orange" outlined>
                Orange
              </Tag>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Arredondadas</h3>
            <div className="flex flex-wrap gap-3">
              <Tag variant="primary" rounded>
                Primary
              </Tag>
              <Tag variant="success" rounded>
                Success
              </Tag>
              <Tag variant="warning" rounded>
                Warning
              </Tag>
              <Tag variant="danger" rounded>
                Danger
              </Tag>
              <Tag variant="info" rounded>
                Info
              </Tag>
            </div>
          </div>
        </div>
      </section>

      {/* Tags com Ícones */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Tags com Ícones</h2>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex flex-wrap gap-3">
            <Tag variant="warning" icon={<Star size={14} />}>
              Favorito
            </Tag>
            <Tag variant="danger" icon={<Zap size={14} />}>
              Urgente
            </Tag>
            <Tag variant="info" icon={<Clock size={14} />}>
              Agendado
            </Tag>
            <Tag variant="purple" icon={<User size={14} />}>
              Atribuído
            </Tag>
          </div>
        </div>
      </section>

      {/* Tags Removíveis */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Tags Removíveis</h2>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Tags Selecionadas (clique no X para remover)
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map((tag) => (
              <CategoryTag
                key={tag}
                category={tag}
                variant="primary"
                removable
                onRemove={() => removeTag(tag)}
              />
            ))}
            {selectedTags.length === 0 && (
              <p className="text-gray-500 text-sm">Nenhuma tag selecionada</p>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2 text-gray-700">
              Clique para adicionar:
            </h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java'].map(
                (tag) => (
                  <CategoryTag
                    key={tag}
                    category={tag}
                    variant={selectedTags.includes(tag) ? 'success' : 'default'}
                    outlined={!selectedTags.includes(tag)}
                    onClick={() => addTag(tag)}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tags Clicáveis */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Tags Clicáveis</h2>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex flex-wrap gap-3">
            <Tag
              variant="primary"
              onClick={() => alert('Tag clicada!')}
            >
              Clique em mim
            </Tag>
            <Tag
              variant="info"
              outlined
              onClick={() => alert('Tag clicada!')}
            >
              Ou em mim
            </Tag>
            <Tag
              variant="success"
              icon={<Star size={14} />}
              onClick={() => alert('Tag clicada!')}
            >
              Ou aqui
            </Tag>
          </div>
        </div>
      </section>

      {/* Exemplo de Uso Prático */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Exemplo de Uso: Card de Tarefa
        </h2>

        <div className="space-y-4">
          {/* Task Card 1 */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Implementar autenticação JWT
              </h3>
              <PriorityTag priority="high" size="sm" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Adicionar sistema de autenticação com JSON Web Tokens para
              proteger as rotas da API.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <CategoryTag category="Backend" variant="purple" size="sm" />
                <CategoryTag category="Security" variant="danger" size="sm" />
                <CategoryTag category="API" variant="info" size="sm" />
              </div>
              <StatusTag status="in_progress" size="sm" />
            </div>
          </div>

          {/* Task Card 2 */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Criar página de dashboard
              </h3>
              <PriorityTag priority="medium" size="sm" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Desenvolver interface do dashboard com gráficos e estatísticas.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <CategoryTag category="Frontend" variant="primary" size="sm" />
                <CategoryTag category="UI/UX" variant="pink" size="sm" />
                <CategoryTag category="Charts" variant="orange" size="sm" />
              </div>
              <StatusTag status="completed" size="sm" />
            </div>
          </div>

          {/* Task Card 3 */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Otimizar queries do banco
              </h3>
              <PriorityTag priority="urgent" size="sm" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Analisar e otimizar queries lentas identificadas no monitoramento.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <CategoryTag category="Database" variant="success" size="sm" />
                <CategoryTag category="Performance" variant="warning" size="sm" />
              </div>
              <StatusTag status="pending" size="sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Exemplo de Uso: Filtros */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Exemplo de Uso: Sistema de Filtros
        </h2>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-700">Status:</h4>
              <div className="flex flex-wrap gap-2">
                <StatusTag status="pending" size="sm" outlined />
                <StatusTag status="in_progress" size="sm" />
                <StatusTag status="completed" size="sm" outlined />
                <StatusTag status="paused" size="sm" outlined />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-700">Prioridade:</h4>
              <div className="flex flex-wrap gap-2">
                <PriorityTag priority="low" size="sm" outlined />
                <PriorityTag priority="medium" size="sm" outlined />
                <PriorityTag priority="high" size="sm" />
                <PriorityTag priority="urgent" size="sm" outlined />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-700">Categorias:</h4>
              <div className="flex flex-wrap gap-2">
                <CategoryTag category="Frontend" variant="primary" size="sm" />
                <CategoryTag category="Backend" variant="purple" size="sm" />
                <CategoryTag category="Design" variant="pink" size="sm" outlined />
                <CategoryTag category="DevOps" variant="orange" size="sm" outlined />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
