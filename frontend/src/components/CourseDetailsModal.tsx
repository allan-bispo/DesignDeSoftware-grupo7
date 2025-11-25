import { useState } from 'react';
import { X, Link as LinkIcon, Plus, MessageSquare, History, ExternalLink, Trash2, Calendar, User, Clock } from 'lucide-react';
import { Course, UsefulLink, Comment } from '../types';
import { format } from 'date-fns';
import Tag, { TagVariant } from './Tag';
import Avatar from './Avatar';

interface CourseDetailsModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCourse: (updatedCourse: Course) => void;
}

export default function CourseDetailsModal({ course, isOpen, onClose, onUpdateCourse }: CourseDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'links' | 'comments' | 'history'>('details');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const handleAddLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;

    const newLink: UsefulLink = {
      id: `link-${Date.now()}`,
      title: newLinkTitle,
      url: newLinkUrl,
      addedAt: new Date(),
    };

    const updatedCourse = {
      ...course,
      usefulLinks: [...(course.usefulLinks || []), newLink],
      actionHistory: [
        {
          id: `action-${Date.now()}`,
          action: 'Link adicionado',
          user: 'Você',
          timestamp: new Date(),
          details: `Adicionou link: ${newLinkTitle}`,
        },
        ...(course.actionHistory || []),
      ],
    };

    onUpdateCourse(updatedCourse);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleRemoveLink = (linkId: string) => {
    const link = course.usefulLinks?.find(l => l.id === linkId);
    const updatedCourse = {
      ...course,
      usefulLinks: course.usefulLinks?.filter(l => l.id !== linkId) || [],
      actionHistory: [
        {
          id: `action-${Date.now()}`,
          action: 'Link removido',
          user: 'Você',
          timestamp: new Date(),
          details: `Removeu link: ${link?.title}`,
        },
        ...(course.actionHistory || []),
      ],
    };
    onUpdateCourse(updatedCourse);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'Você',
      content: newComment,
      createdAt: new Date(),
    };

    const updatedCourse = {
      ...course,
      comments: [...(course.comments || []), comment],
      actionHistory: [
        {
          id: `action-${Date.now()}`,
          action: 'Comentário adicionado',
          user: 'Você',
          timestamp: new Date(),
          details: newComment.substring(0, 50) + (newComment.length > 50 ? '...' : ''),
        },
        ...(course.actionHistory || []),
      ],
    };

    onUpdateCourse(updatedCourse);
    setNewComment('');
  };

  const getTrainingTypeVariant = (type: string): TagVariant => {
    const variants: Record<string, TagVariant> = {
      Frontend: 'info',
      Backend: 'success',
      Fullstack: 'purple',
      DevOps: 'orange',
      Mobile: 'pink',
      'Data Science': 'primary',
    };
    return variants[type] || 'default';
  };

  const completedTasks = course.checklist.filter(item => item.completed).length;
  const totalTasks = course.checklist.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-gray-900">{course.name}</h2>
              <Tag variant={getTrainingTypeVariant(course.trainingType)} size="sm">
                {course.trainingType}
              </Tag>
            </div>
            <p className="text-gray-600">{course.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-4"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'details'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Detalhes
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`py-3 px-1 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'links'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <LinkIcon size={18} />
              Links Úteis
              {course.usefulLinks && course.usefulLinks.length > 0 && (
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                  {course.usefulLinks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-3 px-1 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'comments'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare size={18} />
              Comentários
              {course.comments && course.comments.length > 0 && (
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                  {course.comments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 px-1 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <History size={18} />
              Histórico
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Course Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                      <User size={16} />
                      Responsável
                    </label>
                    <p className="text-gray-900 font-medium">{course.responsible}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                      <Clock size={16} />
                      Duração
                    </label>
                    <p className="text-gray-900 font-medium">{course.duration}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-1 block">
                      Módulos
                    </label>
                    <p className="text-gray-900 font-medium">{course.modules} módulos</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                      <Calendar size={16} />
                      Data de Entrega
                    </label>
                    <p className="text-gray-900 font-medium">{format(course.deliveryDate, 'dd/MM/yyyy')}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-1 block">
                      Progresso
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-primary-600 h-3 rounded-full transition-all"
                          style={{ width: `${course.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{course.completion}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-1 block">
                      Tarefas Concluídas
                    </label>
                    <p className="text-gray-900 font-medium">
                      {completedTasks} de {totalTasks} tarefas
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Notes */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">Notas do Projeto</h3>
                <p className="text-sm text-amber-800">{course.projectNotes}</p>
              </div>

              {/* Checklist */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Checklist de Produção</h3>
                <div className="grid grid-cols-2 gap-3">
                  {course.checklist.map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        readOnly
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-4">
              {/* Add Link Form */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Adicionar Link Útil</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Título do link"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    placeholder="https://exemplo.com"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddLink}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <Plus size={18} />
                    Adicionar Link
                  </button>
                </div>
              </div>

              {/* Links List */}
              <div className="space-y-2">
                {course.usefulLinks && course.usefulLinks.length > 0 ? (
                  course.usefulLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{link.title}</h4>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1"
                        >
                          {link.url}
                          <ExternalLink size={14} />
                        </a>
                        <p className="text-xs text-gray-500 mt-1">
                          Adicionado em {format(link.addedAt, 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveLink(link.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <LinkIcon size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>Nenhum link adicionado ainda</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Add Comment Form */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Adicionar Comentário</h3>
                <textarea
                  placeholder="Escreva seu comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleAddComment}
                  className="mt-3 flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  <MessageSquare size={18} />
                  Adicionar Comentário
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {course.comments && course.comments.length > 0 ? (
                  course.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <Avatar name={comment.author} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">
                              {format(comment.createdAt, 'dd/MM/yyyy HH:mm')}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>Nenhum comentário ainda</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              {course.actionHistory && course.actionHistory.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  {course.actionHistory.map((action) => (
                    <div key={action.id} className="relative pl-12 pb-6">
                      <div className="absolute left-2 top-1 w-4 h-4 bg-primary-600 rounded-full border-4 border-white"></div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{action.action}</h4>
                          <span className="text-xs text-gray-500">
                            {format(action.timestamp, 'dd/MM/yyyy HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Por {action.user}</p>
                        {action.details && (
                          <p className="text-sm text-gray-500 mt-2">{action.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma ação registrada ainda</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
