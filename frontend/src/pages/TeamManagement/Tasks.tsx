import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Calendar, User, AlertCircle } from 'lucide-react';
import { teamService } from '../../services/api/teamService';
import { TaskStatus, TaskPriority } from '../../types';

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
  const [selectedStatus] = useState<TaskStatus | undefined>();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', selectedStatus],
    queryFn: () => teamService.getAllTasks({ status: selectedStatus }),
  });

  const getTasksByStatus = (status: TaskStatus) => {
    return (tasks as any)?.data?.filter((task: any) => task.status === status) || [];
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

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          Carregando...
        </div>
      ) : (
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
                  {columnTasks.map((task: any) => (
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
      )}

      {!isLoading && (!(tasks as any)?.data || (tasks as any).data.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhuma tarefa cadastrada
          </h3>
          <p className="text-gray-500 mb-4">
            Comece criando sua primeira tarefa
          </p>
          <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            Criar Tarefa
          </button>
        </div>
      )}
    </div>
  );
}
