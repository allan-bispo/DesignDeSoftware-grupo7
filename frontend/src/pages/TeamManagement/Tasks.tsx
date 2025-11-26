import { useState } from 'react';
import { Plus, Calendar, User, AlertCircle } from 'lucide-react';
import { TaskAssignment, TaskStatus, TaskPriority, TaskType } from '../../types';

const statusColumns = [
  { status: TaskStatus.PENDING, label: 'Pendente', color: 'bg-gray-100' },
  { status: TaskStatus.IN_PROGRESS, label: 'Em Progresso', color: 'bg-blue-100' },
  { status: TaskStatus.UNDER_REVIEW, label: 'Em Revisão', color: 'bg-yellow-100' },
  { status: TaskStatus.COMPLETED, label: 'Concluída', color: 'bg-green-100' },
  { status: TaskStatus.CANCELLED, label: 'Cancelada', color: 'bg-red-100' },
];

const priorityColors = {
  [TaskPriority.LOW]: 'text-green-600 bg-green-50',
  [TaskPriority.MEDIUM]: 'text-yellow-600 bg-yellow-50',
  [TaskPriority.HIGH]: 'text-orange-600 bg-orange-50',
  [TaskPriority.URGENT]: 'text-red-600 bg-red-50',
};

const priorityLabels = {
  [TaskPriority.LOW]: 'Baixa',
  [TaskPriority.MEDIUM]: 'Média',
  [TaskPriority.HIGH]: 'Alta',
  [TaskPriority.URGENT]: 'Urgente',
};

export default function Tasks() {
  // Dados mockados de tarefas
  const [tasks] = useState<TaskAssignment[]>([
    {
      id: '1',
      title: 'Revisar conteúdo do Módulo 1',
      description: 'Revisar e corrigir o conteúdo textual do primeiro módulo do curso de React.',
      type: TaskType.REVIEW,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assignedTo: {
        id: 'u1',
        name: 'Ana Paula Costa',
        email: 'ana.costa@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      dueDate: '2025-02-10',
      progress: 65,
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-25T14:00:00Z',
    },
    {
      id: '2',
      title: 'Criar ilustrações para slides',
      description: 'Desenvolver 5 ilustrações customizadas para os slides do curso de Python.',
      type: TaskType.ILLUSTRATION,
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      assignedTo: {
        id: 'u2',
        name: 'Carlos Silva',
        email: 'carlos.silva@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      dueDate: '2025-02-15',
      progress: 0,
      createdAt: '2025-01-20T09:00:00Z',
      updatedAt: '2025-01-20T09:00:00Z',
    },
    {
      id: '3',
      title: 'Gravar videoaula sobre APIs REST',
      description: 'Produzir videoaula explicando conceitos de APIs REST e exemplos práticos.',
      type: TaskType.VIDEO_PRODUCTION,
      status: TaskStatus.UNDER_REVIEW,
      priority: TaskPriority.URGENT,
      assignedTo: {
        id: 'u3',
        name: 'Roberto Mendes',
        email: 'roberto.mendes@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      dueDate: '2025-02-05',
      progress: 100,
      createdAt: '2025-01-10T08:00:00Z',
      updatedAt: '2025-01-28T16:00:00Z',
    },
    {
      id: '4',
      title: 'Criar quiz de avaliação final',
      description: 'Elaborar questionário de 20 questões para avaliação do módulo de DevOps.',
      type: TaskType.QUIZ_CREATION,
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.MEDIUM,
      assignedTo: {
        id: 'u4',
        name: 'Fernanda Oliveira',
        email: 'fernanda.oliveira@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      dueDate: '2025-01-30',
      completedAt: '2025-01-28T10:00:00Z',
      progress: 100,
      createdAt: '2025-01-08T11:00:00Z',
      updatedAt: '2025-01-28T10:00:00Z',
    },
    {
      id: '5',
      title: 'Escrever conteúdo sobre Machine Learning',
      description: 'Redigir apostila completa sobre algoritmos de Machine Learning.',
      type: TaskType.CONTENT_WRITING,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assignedTo: {
        id: 'u5',
        name: 'Dr. Paulo Santos',
        email: 'paulo.santos@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      dueDate: '2025-02-20',
      progress: 40,
      createdAt: '2025-01-12T09:00:00Z',
      updatedAt: '2025-01-26T15:00:00Z',
    },
    {
      id: '6',
      title: 'Moderar fórum da semana 3',
      description: 'Responder dúvidas e moderar discussões no fórum do curso de JavaScript.',
      type: TaskType.FORUM_MODERATION,
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
      assignedTo: {
        id: 'u6',
        name: 'Juliana Costa',
        email: 'juliana.costa@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      dueDate: '2025-02-08',
      progress: 0,
      createdAt: '2025-01-18T10:00:00Z',
      updatedAt: '2025-01-18T10:00:00Z',
    },
  ]);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-gray-600 mt-1">Gestão de Tarefas e Atividades</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusColumns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);

          return (
            <div key={column.status} className="flex flex-col">
              <div className={`${column.color} rounded-t-lg p-3`}>
                <h3 className="font-semibold text-sm">
                  {column.label}
                  <span className="ml-2 text-xs opacity-75">
                    ({columnTasks.length})
                  </span>
                </h3>
              </div>

              <div className="bg-gray-50 rounded-b-lg p-2 min-h-[500px] space-y-2">
                {columnTasks.map((task: TaskAssignment) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm flex-1">
                          {task.title}
                        </h4>
                        {task.priority && (
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded ${
                              priorityColors[task.priority as TaskPriority]
                            }`}
                          >
                            {priorityLabels[task.priority as TaskPriority]}
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="space-y-2">
                        {task.assignedTo && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <User size={14} />
                            <span>{task.assignedTo.name}</span>
                          </div>
                        )}

                        {task.dueDate && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Calendar size={14} />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        )}

                        {task.progress !== undefined && (
                          <div>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progresso</span>
                              <span>{task.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Nenhuma tarefa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
